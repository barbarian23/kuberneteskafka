FROM ubuntu:latest
# Create app directory
WORKDIR /home

RUN apt-get update ; \
 apt install bash --yes ; \
 apt install default-jdk --yes ; \
 apt install nano --yes ; \
 apt install curl --yes ; \
 apt install unzip  --yes ; \
 apt install net-tools  --yes ; \
 cd /home && mkdir kafka ; \
 cd /home/kafka && curl -O https://dlcdn.apache.org/kafka/3.2.0/kafka_2.12-3.2.0.tgz && tar -xvzf kafka_2.12-3.2.0.tgz && mv kafka_2.12-3.2.0 kafka ; \
 cd /home/kafka/kafka && mkdir data ; \
 cd /home/kafka/kafka && mkdir kafka-logs ; \
 cd /home/kafka/kafka && mkdir logs ; \
 rm -rf home/kafka/kafka/config/zookeeper.properties ; \
 rm -rf /home/kafka/kafka/config/server.properties ; \
 rm -rf /home/kafka/kafka/config/connect-distributed.properties ; \
 cd /home/kafka/kafka/libs && curl -O https://dbschema.com/jdbc-drivers/MySqlJdbcDriver.zip  ; \
 cd /home/kafka/kafka && mkdir plugins && unzip MySqlJdbcDriver.zip -d /home/kafka/kafka/libs ;  \
 cd /home/kafka/kafka && mkdir plugins ; \
 cd /home/kafka/kafka/plugins && curl -O https://d1i4a15mxbxib1.cloudfront.net/api/plugins/confluentinc/kafka-connect-jdbc/versions/10.4.1/confluentinc-kafka-connect-jdbc-10.4.1.zip ; \
 cd /home/kafka/kafka/plugins && unzip confluentinc-kafka-connect-jdbc-10.4.1.zip -d /home/kafka/kafka/plugins && mv confluentinc-kafka-connect-jdbc-10.4.1 jdbc ; \
 cd /home/kafka/kafka/plugins && curl -O https://repo1.maven.org/maven2/io/debezium/debezium-connector-mysql/1.8.1.Final/debezium-connector-mysql-1.8.1.Final-plugin.tar.gz ; \
 cd /home/kafka/kafka/plugins && tar -xvzf debezium-connector-mysql-1.8.1.Final-plugin.tar.gz && mv debezium-connector-mysql mysql ; \
 rm -rf home/kafka/kafka/bin/kafka-run-class.sh ; \
 rm -rf /home/kafka/kafka/bin/zookeeper-server-start.sh  ; \
 rm -rf /home/kafka/kafka/bin/kafka-server-start.sh  ; \
 rm -rf /home/kafka/kafka/bin/connect-distributed.sh  ; \
 rm -rf /home/kafka/kafka/plugins/confluentinc-kafka-connect-jdbc-10.4.1.zip ; \
 rm -rf /home/kafka/kafka/plugins/debezium-connector-mysql-1.8.1.Final-plugin.tar.gz ; \
 rm -rf /home/kafka/kafka/libs/MySqlJdbcDriver.zip ; \
 cd /home && mkdir nodelog && mkdir swaggerAPI

COPY zookeeper.properties /home/kafka/kafka/config
COPY server.properties /home/kafka/kafka/config
COPY connect-distributed.properties /home/kafka/kafka/config

COPY kafka-run-class.sh /home/kafka/kafka/bin
COPY zookeeper-server-start.sh /home/kafka/kafka/bin
COPY kafka-server-start.sh /home/kafka/kafka/bin
COPY connect-distributed.sh /home/kafka/kafka/bin

COPY nodelog/* /home/nodelog

COPY swaggerAPI/* /home/swaggerAPI

RUN apt install nodejs --yes ; \
    apt install npm --yes ; \
    cd /home/nodelog && mkdir views ; \
    cd /home/nodelog && mv monitorLog.ejs views/ ; \
    cd /home/nodelog && mv monitorTopic.ejs views/ ; \
    cd /home/nodelog && npm install ; \
    npm install -g pm2 ; \
    ls /home/nodelog ; \
    cd /home/nodelog && pm2 start index.js --name nodelog

CMD /home/kafka/kafka/bin/zookeeper-server-start.sh /home/kafka/kafka/config/zookeeper.properties && \
    /home/kafka/kafka/bin/kafka-server-start.sh /home/kafka/kafka/config/server.properties  && \
    /home/kafka/kafka/bin/connect-distributed.sh /home/kafka/kafka/config/connect-distributed.properties 
     