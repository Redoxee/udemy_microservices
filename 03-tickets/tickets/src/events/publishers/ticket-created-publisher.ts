import { Publisher, Subjects, TicketCreatedEvent } from '@amgtickets/common';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
	readonly subject = Subjects.TicketCreated;
}

export { TicketCreatedPublisher };