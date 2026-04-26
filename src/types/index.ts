export interface Machine {
  id: string
  name: string
  model: string
  defaultUnit: number
  previousUnit?: number
}

export type MeterMode = 'total' | 'peakhour'

export interface MachineReading {
  machineId: string
  mode: MeterMode
  // total unit mode
  inputUnit?: number
  // peak hour mode
  peakUnit?: number
  offPeakUnit?: number
  // computed
  totalUnit: number
  totalCost: number
}

export interface MonthData {
  monthKey: string // e.g. "2024-01"
  readings: Record<string, MachineReading>
}

export interface PriceConfig {
  peakRate: number    // BDT per unit during peak
  offPeakRate: number // BDT per unit off-peak
  totalRate: number   // flat rate per unit (total mode)
}

export interface ElectricityRecharge {
  id: string
  date: string       // ISO date string
  amount: number
  source: 'local' | 'office'
}

export interface DeductionConfig {
  vatPercent: number       // e.g. 5
  demandCharge: number     // fixed BDT
  meterCharge: number      // fixed BDT
  localSurchargePercent: number // extra % for local recharge
}

export interface Settings {
  priceConfig: PriceConfig
  deductionConfig: DeductionConfig
  machines: Machine[]
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  factoryName: string
}
