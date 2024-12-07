import re
from string import Template
from typing import List, Dict, Any

import pandas as pd
from neo4j import GraphDatabase


class GraphDbHandler:
    """
    Handles all interactions with a Neo4j graph database, including storing,
    reading, updating data, and running custom Cypher queries.
    """

    def __init__(self, connection_url: str, username: str, password: str):
        self.driver = GraphDatabase.driver(connection_url, auth=(username, password))
        self.driver.verify_connectivity()

    def close(self):
        """Close the Neo4j driver connection."""
        self.driver.close()

    def store_data(self, data: dict):
        try:
            entities, relationships = self.generate_cypher(data)
            for entity_query in entities:
                self.run_query(entity_query)

            for relationship_query in relationships:
                self.run_query(relationship_query)

        except Exception as e:
            print(f"Error storing data: {e}")

    def read_data(self, query: str) -> list[dict] | dict[Any, Any]:
        try:
            result = self.run_query(query)
            return result.to_dict(orient="records")
        except Exception as e:
            print(f"Error reading data: {e}")
            return {}

    def update_data(self, data: dict, query: str):
        try:
            self.run_query(query, params=data)
        except Exception as e:
            print(f"Error updating data: {e}")

    def run_query(self, query: str, params: dict = None) -> pd.DataFrame:
        if not params:
            params = {}
        try:
            with self.driver.session() as session:
                result = session.run(query, params)
                return pd.DataFrame([r.values() for r in result], columns=result.keys())
        except Exception as e:
            print(f"Error in run_query: {e}")
            return pd.DataFrame()

    def initialize_graph(self):
        """
        Initialize the graph with constraints for unique node properties.
        """
        constraints = [
            'CREATE CONSTRAINT unique_person_id IF NOT EXISTS FOR (n:Person) REQUIRE (n.id) IS UNIQUE',
            'CREATE CONSTRAINT unique_position_id IF NOT EXISTS FOR (n:Position) REQUIRE (n.id) IS UNIQUE',
            'CREATE CONSTRAINT unique_skill_id IF NOT EXISTS FOR (n:Skill) REQUIRE n.id IS UNIQUE',
            'CREATE CONSTRAINT unique_education_id IF NOT EXISTS FOR (n:Education) REQUIRE n.id IS UNIQUE',
            'CREATE CONSTRAINT unique_company_id IF NOT EXISTS FOR (n:Company) REQUIRE n.id IS UNIQUE',
            'CREATE CONSTRAINT unique_job_id IF NOT EXISTS FOR (n:Job) REQUIRE n.id IS UNIQUE'
        ]

        for constraint in constraints:
            self.run_query(constraint)

    def run_entity_relation_cypher(self, results: dict):
        """
        Generate and execute Cypher queries for entities and relationships.

        Args:
            results (dict): Results containing entities and relationships.
        """
        try:
            entities, relationships = self.generate_cypher(results)
            for entity_query in entities:
                self.run_query(entity_query)

            for relationship_query in relationships:
                self.run_query(relationship_query)
        except Exception as e:
            print(f"Error in run_entity_relation_cypher: {e}")

    def generate_cypher(self, in_json: dict):
        """
        Generate Cypher queries for entities and relationships.

        Args:
            in_json (dict): Input JSON containing entities and relationships.

        Returns:
            Tuple[List[str], List[str]]: Entity and relationship Cypher statements.
        """
        e_map = {}
        e_stmt = []
        r_stmt = []

        e_stmt_tpl = Template("($id:$label{id:'$key'})")
        r_stmt_tpl = Template("""
          MATCH $src
          MATCH $tgt
          MERGE ($src_id)-[:$rel]->($tgt_id)
        """)

        for obj in in_json['entities']:
            label = obj['label']
            id_value = obj['id']
            varname = self.get_cypher_compliant_var(id_value)
            stmt = e_stmt_tpl.substitute(id=varname, label=label, key=id_value)
            e_map[varname] = stmt
            e_stmt.append('MERGE ' + stmt + self.get_prop_str(obj, varname))

        for rel in in_json['relationships']:
            src_id, relation, tgt_id = map(str.strip, rel.split("|"))
            src_var = self.get_cypher_compliant_var(src_id)
            tgt_var = self.get_cypher_compliant_var(tgt_id)
            stmt = r_stmt_tpl.substitute(
                src_id=src_var, tgt_id=tgt_var, src=e_map[src_var], tgt=e_map[tgt_var], rel=relation
            )
            r_stmt.append(stmt)

        return e_stmt, r_stmt

    @staticmethod
    def get_prop_str(prop_dict: dict, _id: str) -> str:
        """
        Generate a property string for Cypher queries.

        Args:
            prop_dict (dict): Dictionary of properties.
            _id (str): Variable name for the entity.

        Returns:
            str: Formatted property string.
        """
        props = [f"{_id}.{key} = '{str(value).replace('\"', '').replace('\'', '')}'"
                 for key, value in prop_dict.items() if key not in ['label', 'id']]
        return " ON CREATE SET " + ", ".join(props)

    @staticmethod
    def get_cypher_compliant_var(_id: str) -> str:
        """
        Ensure variable names are compliant for Cypher.

        Args:
            _id (str): Identifier string.

        Returns:
            str: Compliant variable name.
        """
        return "_" + re.sub(r'\W|^(?=\d)', '', _id)
