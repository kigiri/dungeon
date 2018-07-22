## Action
  - type **(magical | physical)**
  - target **(player | cell)**
  - area **(amount of cells to spread the action to, default is 0)**
  - power **(amount of power to use, up to 1/3 of current mana)**
  - charge **(amount of time to prepare)**
  - duration **(0 === instant, up to 10 sec)**

> using an area as target 
> over time effects of the same type are not stackable
> physical attacks deal more damages, but are more reduced by tenacity
> ranged physical attacks travel slowly on the map and can be dodged
> magical on friend heal
> physical on friend taunt(based on tenacity)** and buff(based on power)**


## Move
  - target **(unit or cell)**
  - area **(stay at the given distance from the target)**

> while moving, all regenration tick are paused

## Item
  - target **(unit or cell)**


specials:
  teleport **(teleport to the specified area, reduce life and mana depending on distance)**
  charge **(rush thoward a target and improve next action used on them, on enemy bump them)**
  berserk **(mod power and reduce speed of actions, on enemy reduce speed and power)**
  block **(ignore the n next attacks **(based on tenacity)**, on enemy reduce tenacity)**
  absorb **(absorb an amount of damage **(based on spell)**, on enemy absorb heals)**
  counter **(reflect attacks for 2sec, on enemy damages are done on himself)**
  snare **(slow the target movespeed duration 6s, on friend sprint)**
  root **(duration 3s, on friend, remove all CC)**
  fear **(duration 2s, on friend, remove all CC)**
  stun **(duration 2s, on friend, remove all CC)**
  sap **(duration 4s, on friend, remove all CC)**