import nats from 'node-nats-streaming';
import Listener from "./base-listener";
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

class TickedCreatedListener extends Listener<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
	queueGroupName = "order-service";

	onMessage(data: TicketCreatedEvent['data'], msg: nats.Message): void {
		console.log(`concrete listener ${data}`);

		msg.ack();
	}
}

export default TickedCreatedListener;