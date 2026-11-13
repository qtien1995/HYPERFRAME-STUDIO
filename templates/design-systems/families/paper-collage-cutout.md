# AESTHETIC FAMILY: PAPER COLLAGE CUTOUT (CẮT DÁN ĐA CHẤT LIỆU)
<!-- Gợi ý tùy chọn cho chủ đề: Kể chuyện nhân vật, Lịch sử văn hóa, Triết học, Đời sống, Giải thích ngụ ngôn -->

## 1. Tinh thần chủ đạo
Cảm giác thủ công như một cuốn sổ lưu niệm sống động: các mảnh giấy cắt răng cưa, ảnh đơn sắc halftones, ghim bấm, dây chỉ đỏ nối các manh mối và nét vẽ tay SVG tự chạy.

## 2. Gợi ý `:root` Tokens
```css
:root {
  --bg-stage: #EDE6D6;
  --bg-surface: #E2D9C5;
  --bg-elevated: #FBF8F1;
  --bg-overlay: rgba(28, 25, 23, 0.88);
  --bg-hook: #292524;
  --ink-hook: #F5F5F4;
  --ink-primary: #1C1917;
  --ink-secondary: #57534E;
  --ink-dim: rgba(28, 25, 23, 0.22);
  --accent-1: #FDE047;
  --accent-2: #DC2626;
  --status-danger: #B91C1C;
  --status-success: #15803D;
}
```

## 3. Chất liệu & Chuyển động gợi ý
- Sợi dây nối manh mối vẽ bằng `stroke-dashoffset`, các mảnh cắt dán trượt vào với góc nghiêng nhẹ (`rotation: -2deg -> 0deg`) và bóng đổ lớp giấy xếp chồng.
- Camera `#cam` pan ngang/dọc như đang di chuyển trên một bức tường điều tra lớn.
