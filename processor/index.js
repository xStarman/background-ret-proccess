const { CompressionTypes, CompressionCodecs } = require("kafkajs");
const SnappyCodec = require("kafkajs-snappy");
const processLines = require("./app/process-lines");
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;

const { Pool } = require('pg')

const dbConnection = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "consumer1",
  brokers: [process.env.KAFKA_BROKERS],
});

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
});

consumer.connect().then(() => {
  consumer
    .subscribe({ topic: process.env.KAFKA_PROCESS_TOPIC, fromBeginning: true })
    .then(() => {
      consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const jsonMessage = JSON.parse(message.value.toString());
          const file = jsonMessage.file;
          const id = jsonMessage.ret_id
  
          processLines(file, id, dbConnection);
        },
      });
    });
});
