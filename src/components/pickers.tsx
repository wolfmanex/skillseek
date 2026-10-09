import type { Trade } from "@prisma/client";
import { COUNTIES, countyName } from "@/lib/constants";
import { tradeName, type Locale } from "@/lib/i18n";
import { inputCls } from "@/components/ui";

const chip =
  "flex cursor-pointer items-center gap-2 rounded-md border border-stone-200 px-2 py-1.5 text-sm has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50";

export function TradeCheckboxes({ trades, selected, locale }: { trades: Trade[]; selected: string[]; locale: Locale }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {trades.map((trade) => (
        <label key={trade.slug} className={chip}>
          <input type="checkbox" name="trades" value={trade.slug} defaultChecked={selected.includes(trade.slug)} className="accent-amber-500" />
          {tradeName(trade, locale)}
        </label>
      ))}
    </div>
  );
}

export function CountyCheckboxes({ name, selected }: { name: string; selected: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {COUNTIES.map((c) => (
        <label key={c} className={chip}>
          <input type="checkbox" name={name} value={c} defaultChecked={selected.includes(c)} className="accent-amber-500" />
          {countyName(c)}
        </label>
      ))}
    </div>
  );
}

export function CountySelect({ name, value, placeholder, required }: { name: string; value?: string | null; placeholder: string; required?: boolean }) {
  return (
    <select name={name} defaultValue={value ?? ""} required={required} className={inputCls}>
      <option value="">{placeholder}</option>
      {COUNTIES.map((c) => (
        <option key={c} value={c}>{countyName(c)}</option>
      ))}
    </select>
  );
}
