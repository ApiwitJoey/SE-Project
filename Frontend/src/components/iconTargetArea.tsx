export default function BodyPart({ name }: { name: string }) {

  // ตรวจสอบว่ามี icon สำหรับ name นี้ไหม ถ้าไม่มีให้ใช้ defaultIcon
  // const icon = (BodyIcons as Record<string, JSX.Element>)[name] || defaultIcon;

  return (
    <div className="flex items-center border-[2px] border-emerald-600 shadow-lg p-2 rounded-lg bg-emerald-50 ">
  <span className="truncate">{name}</span>
</div>

  );
}
