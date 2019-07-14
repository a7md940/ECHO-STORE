FROM mongo

COPY ./computers.csv /data/
# CMD mongoimport --host mongo --db computer_store --collection computers --type csv --file /data/computers.csv --headerline  