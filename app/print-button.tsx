"use client";

export function PrintButton({ fullName }: { fullName: string }) {
  function handlePrint() {
    const previousTitle = document.title;
    document.title = fullName.trim().replace(/\s+/g, "_") || "Resume";
    window.addEventListener(
      "afterprint",
      () => {
        document.title = previousTitle;
      },
      { once: true },
    );
    window.print();
  }

  return (
    <button
      className="screen-only rounded-sm bg-[#173b43] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#245860] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#318b7f]"
      onClick={handlePrint}
      type="button"
    >
      Print / save as PDF
    </button>
  );
}