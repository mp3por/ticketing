import {Ticket} from "../ticket";

it('implements optimistic concurrency control', async (done) => {
    // create an instace of the ticket
    const ticket = Ticket.build({
        price: 10,
        title: 'OMG',
        userId: 'omg'
    });

    // save the ticket
    await ticket.save();
    
    // fetch the ticket 2 times
    const ticket1 = await Ticket.findById(ticket.id);
    const ticket2 = await Ticket.findById(ticket.id);
    
    // make 2 separate changes to the 2 instances
    ticket1!.set({price:15});
    ticket2!.set({price:102});
    
    // save instance 1
    await ticket1!.save();
    
    try{
        // save instance2
        await ticket2!.save();   
    } catch (e) {
        return done();
    }
    
    throw new Error('should not be able to save instance2')
});

it('increments the version number on save', async () => {
    const ticket = Ticket.build({
        price: 10,
        userId: 'kmg',
        title: 'omg'
    });
    
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    
})
