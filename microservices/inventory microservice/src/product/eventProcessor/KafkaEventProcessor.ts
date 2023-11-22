import { Consumer, KafkaConsumer, Producer, ProducerStream, Message } from 'node-rdkafka';
import { Writable } from 'stream';
import winston from 'winston';
import pEvent from 'p-event';

// Set up a Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

export default class KafkaEventProcessor {
  private consumer: Consumer;
  private producer: ProducerStream;

  constructor() {
    // Read Kafka configuration from environment variables
    const kafkaConsumerConfig = {
      'group.id': process.env.KAFKA_CONSUMER_GROUP_ID || 'group-id',
      'metadata.broker.list': process.env.KAFKA_BROKER_LIST || 'kafka-broker:9092',
    };

    const kafkaProducerConfig = {
      'metadata.broker.list': process.env.KAFKA_BROKER_LIST || 'kafka-broker:9092',
    };

    // Connect Kafka consumer and producer
    this.consumer.connect();
    this.producer.pipe(new Writable({ objectMode: true, write: (message, encoding, callback) => callback() }));
    this.producer.connect();
  }

  public startConsuming(topic: string): void {
    this.consumer
      .on('ready', () => {
        this.consumer.subscribe([topic]);
        this.consumer.consume();
        logger.info(`Consumer is ready and listening to topic: ${topic}`);
      })
      .on('data', async (message: Message) => {
        try {
          const event = JSON.parse(message.value.toString());

          // Process the event, retrieve quantity from inventory, and perform operations
          const quantityRequested = event.quantityRequested; // Replace with your event structure

          // Simulate processing logic (e.g., querying inventory, performing operations)
          const operationResult = await this.processEvent(event);

          // Log the result
          logger.info(`Processed event: ${JSON.stringify(event)}. Result: ${operationResult}`);

          // Publish the response to another topic with retries
          await this.publishResponseWithRetries('response-topic', { result: operationResult, originalEvent: event });
        } catch (error) {
          logger.error(`Error processing event: ${error.message}`);
        }
      })
      .on('disconnected', () => {
        logger.warn('Consumer disconnected');
      })
      .on('event.error', (error) => {
        logger.error(`Error in Kafka consumer: ${error.message}`);
      });
  }

  private async processEvent(event: any): Promise<string> {
    try {
      const productId = event.productId; // Replace with the actual field name in your event
      const quantityReceived = event.quantityReceived; // Replace with the actual field name in your event

      // Retrieve product from the database
      const product = await this.productModel.findOne({ _id: productId });

      if (product) {
        // Process the product and quantityReceived as needed
        const totalQuantity = product.quantity + quantityReceived;

        // Simulate processing logic (e.g., updating quantity in inventory)
        // Replace this with your actual processing logic
        await this.productModel.findByIdAndUpdate(productId, { quantity: totalQuantity });

        return `Processed event: ${JSON.stringify(event)}. Product updated successfully.`;
      } else {
        return `Product with ID ${productId} not found.`;
      }
    } catch (error) {
      logger.error(`Error processing event: ${error.message}`);
      throw error; // Propagate the error
    }
  }

  private async publishResponseWithRetries(topic: string, response: any): Promise<void> {
    try {
      await pEvent(this.producer, 'ready');
      const message = Buffer.from(JSON.stringify(response));

      // Use asynchronous retry with circuit breaker pattern
      await pEvent(
        pEvent.iterator(this.producer, 'delivery-report', { end: false }),
        'finish',
        { rejectionEvents: ['error'] },
        async (report) => {
          if (report.err) {
            throw report.err;
          }
        },
        { retries: 3, onFailedAttempt: (error) => logger.warn(`Failed attempt to publish message: ${error.message}`) }
      );

      this.producer.produce(
        topic,
        null,
        message,
        Date.now(), // Optional timestamp
        null, // Optional partition
        (err, offset) => {
          if (err) {
            logger.error(`Error publishing response to topic ${topic}: ${err.message}`);
          } else {
            logger.info(`Published response to topic ${topic}. Offset: ${offset}`);
          }
        }
      );
    } catch (error) {
      logger.error(`Error publishing response to topic ${topic}: ${error.message}`);
    }
  }
}


