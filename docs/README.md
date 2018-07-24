## Entities
> An entity is anything that can appear on the map.
> They all have a cell attribute

#### `getMove` : `Entity` -> `MoveEvent`

#### `isMoving` : `Entity` -> `Boolean`

## Cells
> A cell is a square block on the map, a place where any entity
> may move to, if free.
> Only unmovable entity truly block a cell

### Constants
- `CELL_MIN` **0**, the value of the first cell
- `CELL_MAX` **181**, the value of the last cell

#### `isCellFree` : `Cell` -> `Boolean`
Check if the cell is in bounds and not occupied by an unmovable entity

#### `getX` : `Cell` -> `Number`

#### `getY` : `Cell` -> `Number`

