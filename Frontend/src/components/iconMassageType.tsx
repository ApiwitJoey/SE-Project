export default function MassageType({ name }: {name : string}) {
  // 3. Type-safe check with type assertion
  // const icon = (MassageIcons as Record<string, JSX.Element>)[name] || defaultIcon;

  return (
    <div className="flex items-center border-[2px] border-emerald-600 shadow-lg p-2 rounded-lg bg-emerald-50 ">
      {/* {icon} */}
      <span className="truncate">{name}</span>
    </div>
  );
}
