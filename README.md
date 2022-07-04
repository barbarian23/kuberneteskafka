I. Purpose
This guide provides a way to monitor Debezium stack deployed on Kubernetes by connecting Jconsole to Kubernetes pod

II. Deploy Debezium stack on Kubernetes pod
Create a pod on Kubernetes pod

Get list node: kubectl get nodes -o wide we will get list node:


Create a pod on node   kubectl debug node/aks-nodepool1-36796465-vmss000000 -it --image=mcr.microsoft.com/dotnet/runtime-deps:6.0  after creating pod, we will access automatically to that pod as root user


Install necessary package

Update package apt-get update

Install jdk apt install default-jdk

Install nano editor apt install nano

Install curl apt install curl

Install unzip apt install unzip 

 Install Zookeeper, Kafka and Kafka Connect 

Make a directory cd /home && mkdir kafka && cd kafka

Download kafka curl -O https://dlcdn.apache.org/kafka/3.2.0/kafka_2.12-3.2.0.tgz

Extract kafka tar -xvzf kafka_2.12-3.2.0.tgz && mv kafka_2.12-3.2.0.tgz kafka && cd kafka 

Set up Zookeeper, Kafka and Kafka Connect

Create data folder and set up Zookeeper

cd /home/kafka/kafka && mkdir data

nano /home/kafka/kafka/config/zookeeper.configuration

change datadir to datadir=/home/kafka/kafka/data 

Create kafka log folder and set up Kafka

cd /home/kafka/kafka && mkdir kafka-log

nano /home/kafka/kafka/config/server.configuration

Change log.dirsto log.dirs=/home/kafka/kafka/kafka-log

Add port=9092 listeners=PLAINTEXT://:9092

Download JDBC connector, mysql connecttor and JDBC bin

cd /home/kafka/kafka && mkdir plugins && cd /home/kafka/kafka/plugins

Download JDBC bin

cd /home/kafka/kafka/libs

curl -O https://dbschema.com/jdbc-drivers/MySqlJdbcDriver.zip

unzip MySqlJdbcDriver.zip -d /home/kafka/kafka/libs 

Download JDBC connector

cd /home/kafka/kafka/plugins

curl -O https://d1i4a15mxbxib1.cloudfront.net/api/plugins/confluentinc/kafka-connect-jdbc/versions/10.4.1/confluentinc-kafka-connect-jdbc-10.4.1.zip 

unzip confluentinc-kafka-connect-jdbc-10.4.1.zip -d /home/kafka/kafka/plugins

mv confluentinc-kafka-connect-jdbc-10.4.1 jdbc

Download mysql connector

cd /home/kafka/kafka/plugins

curl -O https://repo1.maven.org/maven2/io/debezium/debezium-connector-mysql/1.8.1.Final/debezium-connector-mysql-1.8.1.Final-plugin.tar.gz

tar -xvzf debezium-connector-mysql-1.8.1.Final-plugin.tar.gz

mv debezium-connector-mysql mysql

Edit nano /home/kafka/kafka/connect-distributed.properties

plugin.path=/home/kafka/kafka/plugins , 

Expose a service for Kubernetes’s pod

Set label for pod

kubectl label pods <pod name> app=debezium

Create a service for open port (this will create External IP for pod after a while)

kubectl expose pod <pod name> --type=LoadBalancer --name=debezium --port 9010 --target-port 9010 --selector=app=debezium

Edit service for JMX’s port and Kakfa Connect’s port

 kubectl patch svc <my_service> --patch '{"spec": {"ports": [{"port": 8083,"targetPort": 8083,"name": "kafkaconnect"},{"port": 9010,"targetPort": 9010,"name": "jmxzookeeper"},{"port": 9011,"targetPort": 9011,"name": "jmxkafka"},{"port": 9012,"targetPort": 9012,"name": "jmxkafkaconnect"}],"type": "LoadBalancer"}}'

Get pod’s external ip

kubectl get service 

Set up JMX configuration for Zookeeper, Kafka

Head to Kafka’s bin folder cd /home/kafka/kafka/bin

Edit JMX OPTION nano /home/kafka/kafka/bin/kafka-run-class.sh

Edit KAFKA_JMX_OPTS  with value -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.authenticate=false  -Dcom.sun.management.jmxremote.ssl=false -Dzookeeper.jmx.log4j.disable=false -Djava.rmi.server.hostname=<above IP> 

Edit JMXPORT with value $KAFKA_JMX_OPTS -Dcom.sun.management.jmxremote.port=$JMX_PORT -Dcom.sun.management.jmxremote.rmi.port=$JMXPORT 

Edit Zookeeper’s JMX PORT nano /home/kafka/kafka/bin/zookeeper-server-start.sh

export JMXPORT=9010

Edit Kafka’s JMX PORT nano /home/kafka/kafka/bin/kafka-server-start.sh

export JMXPORT=9011

Edit Kafka Connect’s JMX PORT nano /home/kafka/kafka/bin/connect-distributed.sh

export JMXPORT=9012

Start Debezium stack

Start Zookeeper

/home/kafka/kafka/bin/zookeeper-server-start.sh /home/kafka/kafka/config/zookeeper.properties

Start Kafka

/home/kafka/kafka/bin/kafka-server-start.sh /home/kafka/kafka/config/server.properties

Start Kakfa Connect

/home/kafka/kafka/bin/connect-distributed.sh /home/kafka/kafka/config/connect-distributed.properties

Test Jconsole connection

Get IP of Kubernetes

kubectl get service

Remote connect to monitor Zookeeper with address <External IP of pod>: <Zookeeper’s port>

Remote connect to monitor Kafka with address <External IP of pod>: <Kafka’s port>

Remote connect to monitor Kafka Connect with address <External IP of pod>: <Kafka connect’s port>