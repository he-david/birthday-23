import type { ComponentType } from 'react'
import type { StageId } from '../state/types'
import { Drive1 } from './Drive1'
import { Drive2 } from './Drive2'
import { Finale } from './Finale'
import { Kart } from './Kart'
import { Lunch } from './Lunch'
import { Prep } from './Prep'
import { Siofok } from './Siofok'

export const STAGE_COMPONENTS: Record<StageId, ComponentType> = {
  prep: Prep,
  drive1: Drive1,
  siofok: Siofok,
  lunch: Lunch,
  drive2: Drive2,
  kart: Kart,
  finale: Finale,
}
