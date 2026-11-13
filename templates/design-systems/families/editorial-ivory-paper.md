# AESTHETIC FAMILY: EDITORIAL IVORY PAPER (GIẤY NGÀ & BÀN SOI TÀI LIỆU)

> Họ thẩm mỹ tham khảo cho các chủ đề: Lịch sử, Văn học, Luật pháp, Kinh tế học, Giải mã hồ sơ, Phân tích điều khoản.

## 1. CẢM XÚC THỊ GIÁC (EMOTIONAL INTENT)
Cảm giác như người xem đang mở một cuốn hồ sơ lưu trữ hoặc bản thảo cổ điển trên bàn soi tài liệu (light-box) ấm áp. Bề mặt giấy ngà có vân sợi cellulose, mực than chì graphite sắc sảo, bút dạ quang quẹt nổi bật từng từ khóa trọng yếu.

---

## 2. SEMANTIC TOKENS (`:root`)

```css
:root {
  /* Surfaces */
  --bg-stage: #F4EFE6;         /* Giấy ngà cổ điển ấm áp */
  --bg-surface: #EBE4D5;       /* Trang tài liệu bên dưới */
  --bg-elevated: #FFFDF9;      /* Vùng được đèn bàn chiếu trực diện */
  --bg-overlay: rgba(31, 29, 26, 0.88); /* Dải phụ đề nền mực tối bán trong suốt */

  /* Đặc quyền Phá Cách Cảnh 1 Hook (Tùy chọn) */
  --bg-hook: #1F1D1A;
  --ink-hook: #F4EFE6;

  /* Ink & Typography */
  --ink-primary: #1F1D1A;      /* Mực than chì graphite đầm chắc */
  --ink-secondary: #5A534A;    /* Mực ghi chú bên lề */
  --ink-dim: #CFC6B4;          /* Chữ ma, vạch skeleton chìm bên dưới */

  /* Accents & Highlights */
  --accent-1: #FDE047;         /* Điểm nhấn chủ đạo & highlight từ khóa Karaoke */
  --accent-2: #1E7F86;         /* Xanh cổ vịt đối chiếu cơ chế */
  --accent-highlight: #FDE047; /* Bút dạ quang vàng ấm (Karaoke & Wipe) */
  --accent-amber: #D9922E;     /* Hổ phách nhấn mốc thời gian */
  --accent-teal: #1E7F86;      /* Xanh cổ vịt đối chiếu */
  --accent-emerald: #00A758;   /* Xanh lục bảo xác nhận */
  --status-danger: #C2352B;    /* Mực con dấu đỏ cảnh báo / phủ định */
  --status-success: #00A758;   /* Mực con dấu xanh chấp thuận */

  /* Tactile Lighting */
  --lamp-vignette: radial-gradient(circle 850px at 50% 38%, rgba(255,253,245,0.85) 0%, rgba(244,239,230,0) 80%);
  --paper-shadow: 0 16px 40px rgba(31, 29, 26, 0.14), 0 4px 12px rgba(31, 29, 26, 0.08);
}
```

---

## 3. PROCEDURAL CANVAS MẪU (`rng(seed)`)
```javascript
function drawIvoryPaper(canvas, width = 1080, height = 1920, seed = 20261107) {
  let s = seed;
  const rng = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const ctx = canvas.getContext('2d');
  const w = canvas.width = width;
  const h = canvas.height = height;
  ctx.fillStyle = '#F4EFE6';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(31, 29, 26, 0.024)';
  for (let i = 0; i < 40000; i++) {
    const x = rng() * w, y = rng() * h, r = rng() * 1.3;
    ctx.fillRect(x, y, r, r);
  }
}
```

---

## 4. LIVING METAPHORS GỢI Ý
- **Tập hồ sơ / Cổ thư lật mở**: Các trang giấy xoay mở hoặc tách lớp dưới đèn bàn soi.
- **Bàn cân cơ học & Hải đồ tự vẽ**: Nét mực SVG tự khắc và cân đối trọng lượng.
- **Bút dạ quang (Highlighter Wipe) & Con dấu đàn hồi**: Dòng chữ được quét dạ quang vàng bằng mask wipe, con dấu đập nảy với `back.out(1.7)`.
