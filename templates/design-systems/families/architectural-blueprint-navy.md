# AESTHETIC FAMILY: ARCHITECTURAL BLUEPRINT NAVY (BẢN VẼ KIẾN TRÚC & MỰC HẢI QUÂN)

> Họ thẩm mỹ tham khảo cho các chủ đề: Kỹ thuật, Kiến trúc hệ thống, Cơ học, Quy hoạch, Cấu trúc tài chính, Giải phẫu công trình. ("Navy" là màu MỰC đường nét bản vẽ trên nền giấy can sáng).

## 1. CẢM XÚC THỊ GIÁC (EMOTIONAL INTENT)
Cảm giác bản vẽ kỹ thuật kiến trúc, bản thiết kế công trình kiên cố của một kỹ sư trên nền giấy can sáng. Đường nét vector mảnh dẻ, sắc nét, vững chãi, chuẩn xác. Mực xanh hải quân `#1E3A8A` kết hợp xanh ngọc lục bảo `#00A758` và xanh lam kỹ thuật `#0EA5E9`.

---

## 2. SEMANTIC TOKENS (`:root`)

```css
:root {
  /* Surfaces — nền giấy can bản vẽ */
  --bg-stage: #F5F2EB;         /* Kem sáng giấy can kiến trúc */
  --bg-surface: #ECE7DC;       /* Mặt phẳng bản vẽ kỹ thuật */
  --bg-elevated: #FFFDF8;      /* Vùng chiếu sáng nổi */
  --bg-overlay: rgba(31, 41, 55, 0.88); /* Nền phụ đề mực sẫm */

  /* Đặc quyền Phá Cách Cảnh 1 Hook (Tùy chọn) */
  --bg-hook: #1E3A8A;
  --ink-hook: #F5F2EB;

  /* Ink & Typography */
  --ink-primary: #1E3A8A;      /* Mực xanh hải quân blueprint */
  --ink-secondary: #475569;    /* Nhãn thông số kỹ thuật */
  --ink-dim: #C7C2B4;          /* Dây văng nền, lưới tọa độ chìm */

  /* Accents & Highlights */
  --accent-1: #FDE047;         /* Điểm nhấn chủ đạo & highlight từ khóa Karaoke */
  --accent-2: #0EA5E9;         /* Đường kích thước bản vẽ CAD */
  --accent-highlight: #FDE047; /* Highlight phụ đề & bút dạ quang */
  --accent-emerald: #00A758;   /* Xanh ngọc lục bảo xác nhận */
  --accent-cyan: #0EA5E9;      /* Đường kích thước bản vẽ CAD */
  --accent-amber: #F59E0B;     /* Cảnh báo tải trọng */
  --status-danger: #C2352B;    /* Đứt gãy, quá tải */
  --status-success: #00A758;   /* Chịu lực vững vàng */

  /* Blueprint Grid & Lighting */
  --blueprint-grid: radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.06) 0%, rgba(245, 242, 235, 0) 70%);
  --shadow-tactile: 0 14px 38px rgba(31, 41, 55, 0.12), 0 4px 10px rgba(31, 41, 55, 0.06);
}
```

---

## 3. PROCEDURAL CANVAS MẪU (`rng(seed)`)
```javascript
function drawBlueprintGrid(canvas, width = 1080, height = 1920, seed = 20261108) {
  let s = seed;
  const rng = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const ctx = canvas.getContext('2d');
  const w = canvas.width = width;
  const h = canvas.height = height;
  ctx.fillStyle = '#F5F2EB';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(30, 58, 138, 0.02)';
  for (let i = 0; i < 30000; i++) {
    ctx.fillRect(rng() * w, rng() * h, 1.1, 1.1);
  }
  ctx.fillStyle = 'rgba(30, 58, 138, 0.12)';
  for (let x = 40; x < w; x += 80) {
    for (let y = 40; y < h; y += 80) {
      ctx.fillRect(x, y, 2, 2);
    }
  }
}
```

---

## 4. LIVING METAPHORS GỢI Ý
- **Trụ cầu dây văng & Kết cấu chịu lực**: Dây cáp tự căng ra theo nhịp GSAP SVG `strokeDashoffset`.
- **Thước đo cơ học & Cổng khóa**: Vạch đo micromet tự trượt và thu phóng tỷ lệ.
- **Bản vẽ mặt cắt công trình (Cross-section Blueprint)**: Khối kiến trúc tự bóc tách từng lớp cơ chế.
