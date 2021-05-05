# Description

This project has only 1 purpose - to illustrate how the NATS Streaming Server works

# How to use 
1. Expose NATS POD port `k port-forward nats-depl-<> 4222:4222`
2. run `npm start publish` or `npm start listen`

# Caviets

## Having multiple listeners of same type
If we have multiple listeners of the same type it might not be a good idea to just give them the new msg. If those listeners then process the same event 
they will be duplicating the work on it.

-> for this we use `QueueGroups` - NATS streaming server will send to only 1 of the members of a QueueGroup
