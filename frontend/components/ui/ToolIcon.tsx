import type { IconType } from "@/config/tools";

interface ToolIconProps {
  type: IconType;
  className?: string;
  size?: number;
}

export function ToolIcon({ type, className = "text-white", size = 28 }: ToolIconProps) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", className };

  switch (type) {
    case "merge":
      return (
        <svg {...props}>
          <path d="M4 6h7M4 12h5M4 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "split":
      return (
        <svg {...props}>
          <path d="M20 6h-7M20 12h-5M20 18h-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 6L4 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "compress":
      return (
        <svg {...props}>
          <path d="M4 14l4 4 4-4M8 18V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 10l-4-4-4 4M16 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "repair":
      return (
        <svg {...props}>
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "ocr":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 8h10M7 12h6M7 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="17" cy="16" r="2" stroke="currentColor" strokeWidth="2" />
          <path d="M19 18l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "img_to_pdf":
      return (
        <svg {...props}>
          <rect x="2" y="4" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="5.5" cy="7.5" r="1" fill="currentColor" />
          <path d="M2 11l3-3 2.5 2.5L10 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 6h6v14H8v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "word_to_pdf":
    case "ppt_to_pdf":
    case "xls_to_pdf":
      return (
        <svg {...props}>
          <path d="M4 4h10l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M14 4v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M16 12l4 4m0-4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "pdf_to_img":
      return (
        <svg {...props}>
          <path d="M4 4h10l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M14 4v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M7 15l2-2 2 2 3-3 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8.5" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case "pdf_to_word":
    case "pdf_to_ppt":
    case "pdf_to_xls":
    case "pdf_to_pdfa":
      return (
        <svg {...props}>
          <path d="M4 4h10l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M14 4v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 12l2 2-2 2M8 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "rotate":
      return (
        <svg {...props}>
          <path d="M4 12a8 8 0 018-8v-2l3 3-3 3V6a6 6 0 106 6h2a8 8 0 01-8 8 8 8 0 01-8-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "page_num":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 8h6M7 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 18h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 15v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "watermark":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 18h7M18 15l2 3-2 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "crop":
      return (
        <svg {...props}>
          <path d="M6 2v14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 6h14v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "edit":
      return (
        <svg {...props}>
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "unlock":
      return (
        <svg {...props}>
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 11V7a5 5 0 019.9-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" />
        </svg>
      );
    case "protect":
      return (
        <svg {...props}>
          <path d="M12 2l8 3v7c0 5-4 8.5-8 10C8 20.5 4 17 4 12V5l8-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "sign":
      return (
        <svg {...props}>
          <path d="M20 20H7L3 16V4a1 1 0 011-1h12a1 1 0 011 1v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 17c0-1.7 1.3-3 3-3s3 1.3 3 3v3h-6v-3z" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "redact":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <rect x="6" y="9" width="8" height="3" rx="1" fill="currentColor" />
          <path d="M6 15h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "compare":
      return (
        <svg {...props}>
          <rect x="2" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
          <path d="M11 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "ai":
      return (
        <svg {...props}>
          <path d="M12 2l2.4 7.4H22l-6.4 4.6 2.4 7.4L12 17l-6 4.4 2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "translate":
      return (
        <svg {...props}>
          <path d="M5 8l6 6M4 6h7M2 6h2M9 6v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M2 4h11M2 19h4l5-12h1l5 12h-3M15 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "remove_pages":
      return (
        <svg {...props}>
          <path d="M4 4h10l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M14 4v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 11l6 6M15 11l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "extract":
      return (
        <svg {...props}>
          <path d="M4 4h10l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M14 4v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "organize":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "scan":
      return (
        <svg {...props}>
          <path d="M4 7V5a2 2 0 012-2h2M4 17v2a2 2 0 002 2h2M20 7V5a2 2 0 00-2-2h-2M20 17v2a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "html_to_pdf":
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}
