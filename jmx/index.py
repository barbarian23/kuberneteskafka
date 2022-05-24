# from jmxquery import JMXConnection
# from jmxquery import JMXQuery;

# try:
#     print("start connection")
#     jmxConnection = JMXConnection("service:jmx:rmi:///jndi/rmi://localhost:9010/jmxrmi")
#     print("connection",jmxConnection.connection_uri)
#     jmxConnection.java_path
#     jmxQuery = [JMXQuery("kafka.cluster:type=*,name=*,topic=*,partition=*",
#                             metric_name="kafka_cluster_{type}_{name}",
#                             metric_labels={"topic" : "{topic}", "partition" : "{partition}"})]
#     metrics = jmxConnection.query(jmxQuery)
#     for metric in metrics:
#         print(f"{metric.metric_name}<{metric.metric_labels}> == {metric.value}")
# except Exception as e: 
#     print("Exception",e)

import jpype
from jpype import java
from jpype import javax

HOST='localhost'
PORT=9000
USER=''
PASS=''