# AESTHETIC FAMILY: CLINICAL PRECISION TEAL (LÂM SÀNG & KHOA HỌC CHÍNH XÁC)

> Họ thẩm mỹ tham khảo cho các chủ đề: Y sinh học, Sức khỏe, Phòng thí nghiệm, Giám định khoa học, Công nghệ sạch, Phân tích dữ liệu vi mô.

## 1. CẢM XÚC THỊ GIÁC (EMOTIONAL INTENT)
Cảm giác phòng thí nghiệm hoặc bàn giám định khoa học hiện đại, chuẩn xác từng milimet, khách quan và đáng tin cậy. Bề mặt kính mờ (frosted glass), vạch kẻ vi mô (micrometer rules), thước đo lâm sàng, sắc xanh teal kết hợp nền trắng băng tinh khiết.

---

## 2. SEMANTIC TOKENS (`:root`)

```css
:root {
  /* Surfaces */
  --bg-stage: #F0F5F5;         /* Trắng băng lâm sàng */
  --bg-surface: #E3ECEB;       /* Mặt kính giám định */
  --bg-elevated: #FFFFFF;      /* Bề mặt nổi bật */
  --bg-overlay: rgba(15, 32, 39, 0.88); /* Nền phụ đề sẫm màu */

  /* Đặc quyền Phá Cách Cảnh 1 Hook (Tùy chọn) */
  --bg-hook: #0F252C;
  --ink-hook: #F0F5F5;

  /* Ink & Typography */
  --ink-primary: #0F252C;      /* Xanh đen thẫm lâm sàng */
  --ink-secondary: #3D5A64;    /* Chú thích thông số khoa học */
  --ink-dim: #A8BFC5;          /* Lưới tọa độ, vạch xung nền */

  /* Accents & Highlights */
  --accent-1: #FDE047;         /* Điểm nhấn chủ đạo & highlight từ khóa Karaoke */
  --accent-2: #0D9488;         /* Teal khoa học chuẩn xác */
  --accent-highlight: #FDE047; /* Highlight phụ đề */
  --accent-teal: #0D9488;      /* Teal khoa học chuẩn xác */
  --accent-cyan: #06B6D4;      /* Tia quét cảm biến / quang học */
  --accent-emerald: #059669;   /* Xác nhận an toàn / đạt chuẩn */
  --status-danger: #E11D48;    /* Cảnh báo vượt ngưỡng */
  --status-success: #059669;   /* Trạng thái cân bằng / thông qua */

  /* Clinical Glass & Glow */
  --glass-border: 1px solid rgba(13, 148, 136, 0.2);
  --scanner-beam: linear-gradient(180deg, rgba(6,182,212,0) 0%, rgba(6,182,212,0.4) 50%, rgba(6,182,212,0) 100%);
  --shadow-clinical: 0 12px 32px rgba(15, 37, 44, 0.08), 0 2px 6px rgba(15, 37, 44, 0.04);
}
```

---

## 3. PROCEDURAL CANVAS MẪU (`rng(seed)`)
```javascript
function drawClinicalGrid(canvas, width = 1080, height = 1920, seed = 20261108) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = width;
  const h = canvas.height = height;
  ctx.fillStyle = '#F0F5F5';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(13, 148, 136, 0.045)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
}
```

---

## 4. LIVING METAPHORS GỢI Ý
- **Thấu kính quang học trượt trục thời gian**: Phóng đại cấu trúc vi mô hoặc sự kiện ẩn.
- **Dải quét cảm biến quang học (Optical Scanner)**: Băng sáng quét dọc sơ đồ làm lộ thông số bên dưới.
- **Thước đo micromet & Van điều áp**: Tự động nhảy số đo và đóng/mở chốt cơ học.
