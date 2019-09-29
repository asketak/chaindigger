#!flask/bin/python
from flask import Flask, jsonify
from neo4j import GraphDatabase
from pprint import pprint
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "admin"))



def build_neo4j_req_from_rest_req(r):

    ret = ""
    constring = " where "

    req = ""

    pprint(r)

    if 'sent-depth' in r:
        req = "MATCH path=(previousNode:ADDRESS)-[r*1.." + str(r["sent-depth"]) + \
            "]->(centralNode:ADDRESS {hash:\"" + r["address"] + "\"})"

    if 'received-depth' in r:
        req = "MATCH path=(centralNode:ADDRESS {hash:\"" + r["address"] + \
            "\"})-[rr*1.." + str(r["received-depth"]) + "]->(endNode:ADDRESS) "

    if 'sent-depth' in r and 'received-depth' in r:
        req = "MATCH path=(previousNode:ADDRESS)-[r*1.." + str(r["sent-depth"]) + \
            "]->(centralNode:ADDRESS {hash:\"" + r["address"] + "\"})-[rr*.." + \
              str(r["received-depth"]) + "]->(endNode:ADDRESS) "



    # if 'date-start' in r:
    #     req += constring + \
    #         "all(rel in relationships(path) WHERE rel.timestamp > " + \
    #         r['date-start'] + " )"
    #     constring = " and "
    # if 'date-end' in r:
    #     req += constring + \
    #         "all(rel in relationships(path) WHERE rel.timestamp < " + \
    #         r['date-end'] + ")"
    #     constring = " and "

    # if 'balance-more-than' in r:
    #     req += constring + "endNode.balance >= " + r['balance-more-than']
    #     constring = " and "
    # if 'balance-less-than' in r:
    #     req += constring + "endNode.balance <= " + r['balance-less-than']
    #     constring = " and "

    if 'sent-minimum' in r:
        req +="WHERE all(n IN relationships(path) WHERE n.amount >=" + str(r['sent-minimum']) + ")" 
        # req += constring + "r.amount > " + str(r['sent-minimum'])
        constring = " and "

    # if 'received-minimum' in r:
    #     req += constring + "rr.amount < " + str(r['received-minimum'])
    #     constring = " and "

    req += " RETURN nodes(path),relationships(path) LIMIT 100"

    print(req)
    return req


@app.route('/request_handler', methods=['GET', 'POST'])
def create_task():

    #######################################
    # create neo4j request
    req = ""
    pprint(request.get_json())
    r = request.get_json()
    req = build_neo4j_req_from_rest_req(r)

    with driver.session() as session:
        result = session.run(req)

    nodes = []
    rels = []

    #######################################
    # transform results to sane json

    # g = result.graph()
    # print( g.nodes )
    # print( g.relationships )

    print("STAAART")
    visited_nodes = {}
    visited_relationships = {}
    for res in result:

        for node in res.data()['nodes(path)']:
            nd = {'hash' : node['hash']}
            if node['hash'] not in visited_nodes.keys():
                nodes.append(nd)
                visited_nodes[node['hash']] = 1
        for rel in res.data()['relationships(path)']:
            hsh = rel['hash']
            amount = rel['amount']
            asset = rel['asset']
            timestamp = rel['timestamp']

            start = rel.start_node['hash']
            end = rel.end_node['hash']
            rl = {'hash': hsh,
                  'amount': amount,
                  'asset': asset,
                  'timestamp': timestamp,
                  'start': start,
                  'end': end}
            if start + end not in visited_relationships.keys():
                visited_relationships[start+end] = 1
                rels.append(rl)
    print("KONEEEEEC")

    ret = { 'nodes': nodes, 'edges': rels}
    return jsonify(ret), 201
