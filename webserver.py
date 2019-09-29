#!flask/bin/python
from flask import Flask, jsonify
from neo4j import GraphDatabase
from pprint import pprint
from flask import request

app = Flask(__name__)
CORS(app)

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("admin", "admin"))


#
# {

#     address: penezenky ktery ziskali penize od tehle adresy
#     received - depth: penezenky ktery ziskali pres maximum tehle hloubky
#     sent - depth: penezenky ktery poslali pres maximum tehle hloubky

#     date - start: milisekundy od epochy
#     date - end: milisekundy od epochy
#     balance - more - than: vic nez nebo rovna se tendle balance
#     balance - less - than: min nez nebo rovna se tendle balance


#     sent - more - than: penezenky ktery poslali vic nez nebo rovna se tendle balance
#     received - more - than: penezenky ktery ziskali vic nez nebo rovna se tendle balance
# }


def build_neo4j_req_from_rest_req(r):

    ret = ""
    constring = " where "

    if 'sent-depth' in r and 'received-depth' in r:
        req = "MATCH path=(previousNode:Address)-[r2:Transaction*.." + r["sent-depth"] + \
            "]->(centralNode:Address {hash:\"" + r["address"] + "\"})-[*.." + \
            r["received-depth"] + "]->(endNode:Address) "

    if 'sent-depth' in r:
        req = "MATCH path=(previousNode:Address)-[r2:Transaction*.." + r["sent-depth"] + \
            "]->(centralNode:Address {hash:\"" + r["address"] + "\"})"

    if 'received-depth' in r:
        req = "MATCH path=(centralNode:Address {hash:\"" + r["address"] + \
            "\"})-[*.." + r["received-depth"] + "]->(endNode:Address) "

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

    # if 'received-more-than' in r:
    #     req += constring + "r2.amount > " + r['balance-less-than']
    #     constring = " and "

    # if 'received-less-than' in r:
    #     req += constring + "r2.amount < " + r['balance-less-than']
    #     constring = " and "

    req += " RETURN path LIMIT 100"
    return req


@app.route('/request_handler', methods=['GET', 'POST'])
def create_task():

    #######################################
    # create neo4j request
    req = ""
    if not request.get_json(silent=True) or not 'request' in request.get_json(silent=True):
        req = "MATCH path=(startNode:Address {hash:\"0x1a06816065731fcbd7296f9b2400d632816b070b\"})-[*2..3]->(endNode:Address) RETURN nodes(path),relationships(path) LIMIT 10"
        # abort(400)
    else:
        r = request.json['request'],
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
    for res in result:
        for node in res.data()['nodes(path)']:
            nd = {'hash' : node['hash']}
            nodes.append(nd)
        for rel in res.data()['relationships(path)']:
            hsh = rel['hash']
            start = rel.start_node['hash']
            end = rel.end_node['hash']
            rl = {'hash': hsh,
                  'start': start,
                  'end': end}
            rels.append(rl)
    pprint(nodes)
    pprint(rels)
    print("KONEEEEEC")

    ret = { 'nodes': nodes, 'edges': rels}
    pprint(ret)
    return jsonify(ret), 201
