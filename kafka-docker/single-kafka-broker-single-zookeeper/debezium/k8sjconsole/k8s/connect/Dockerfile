FROM quay.io/debezium/connect:1.9
ENV KAFKA_CONNECT_JDBC_DIR=$KAFKA_CONNECT_PLUGINS_DIR/kafka-connect-jdbc 

# Deploy MySQL JDBC Driver
ADD bin /kafka/libs

RUN mkdir /kafka/etc && cd /kafka/etc &&\
        curl -so jmx_prometheus_javaagent.jar \
        https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.15.0/jmx_prometheus_javaagent-0.15.0.jar

# Deploy Kafka Connect JDBC, MYSQL
RUN mkdir /kafka/plugins 
ADD plugins /kafka/plugins
COPY config.yml /kafka/etc/config.yml