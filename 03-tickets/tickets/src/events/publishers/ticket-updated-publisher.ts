import { Publisher, Subjects, TicketUpdatedEvent } from '@amgtickets/common';

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
	readonly subject = Subjects.TicketUpdated;
}

export { TicketUpdatedPublisher };