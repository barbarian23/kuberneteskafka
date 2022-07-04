FROM java

# Zookeeper from Kafka 0.10.01
ADD https://dlcdn.apache.org/zookeeper/zookeeper-3.8.0/apache-zookeeper-3.8.0-bin.tar.gz /kafka.tgz
RUN powershell -NoProfile -Command \
        7z.exe e \kafka.tgz -o\             ; \
        7z.exe x \kafka.tar -o\             ; \
        mv \kafka \"\zookeeper\"            ; \
        rm \kafka.tar                       ; \
        rm \kafka.tgz

# Data Directory
#RUN New-Item -Path Data -ItemType Directory
RUN mkdir data
RUN $ZKProps = \"\zookeeper\config\zookeeper.properties\" ; \
        $ZP = [IO.File]::ReadAllText($ZKProps)            ; \  
        $ZP = $ZP.Replace("/tmp/zookeeper","/data")   ; \
        [IO.File]::WriteAllText($ZKProps, $ZP)

# Configure Service
ADD server.properties "C:\Kafka\config\server.properties"

CMD Write-Host "Starting Replicator Services (**logs are in /Replicator)"           
# Run Service
CMD /zookeeper/bin/windows/zookeeper-server-start.bat /zookeeper/config/

# Run Service
CMD /kafka/bin/windows/kafka-server-start.bat /kafka/config/server.properties
#zookeeper.properties