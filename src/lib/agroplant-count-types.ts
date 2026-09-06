export type CountLot = {
  id: number; started: string; updated: string; order_number: string;
  variety: string; description: string; quantity: number; active: number;
};
export type CountSnapshot = {
  rows: CountLot[]; current: CountLot; revision: number; observed_at: string;
  export: { local_saved: string | null; local_revision: number; local_error: boolean;
    usb: {label: string; status: string; saved: string | null; saved_revision?: number}[];
    usb_error: boolean;
  };
};
