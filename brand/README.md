# Brand Profiles

Brand là **tùy chọn theo từng dự án**. Mỗi dự án khai báo trong `projects/<id>/inputProps.json`:

```json
{ "brand": "tien-duong" }   // nạp brand/tien-duong/profile.json
{ "brand": "none" }         // không outro thương hiệu, không CTA (mặc định khi bỏ trống)
```

## Thêm brand mới

Tạo `brand/<id>/profile.json` (id chỉ gồm chữ, số, `-`, `_`):

| Trường | Bắt buộc | Ý nghĩa |
|---|---|---|
| `creatorName`, `title`, `company`, `brandName` | Không | Thông tin hiển thị ở outro |
| `cta`, `ctaKeyword` | Không | Câu kêu gọi hành động; bỏ trống nếu brand không cần CTA |
| `forbiddenCtaPatterns` | Không | Mảng regex (chuỗi) bị cấm trong DESIGN/Blueprint/build-index của dự án dùng brand này |
| `handle`, `disclaimer` | Không | Handle mạng xã hội, dòng miễn trừ |
| `logo` | Không | Đường dẫn tương đối từ gốc workspace. Nếu khai báo, QC T4.3 yêu cầu file tồn tại |
| `hashtags` | Không | Hashtag bổ sung khi đóng gói |
| `outro` | Không | `{ "required": true/false, ... }` gợi ý cho Creative Director |

Hồ sơ mẫu hiện tại nằm tại `brand/tien-duong/profile.json` (kèm `brand/tien-duong/logo.png`).
