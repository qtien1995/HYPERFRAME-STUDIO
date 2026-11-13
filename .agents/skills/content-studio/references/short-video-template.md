# Adaptive Deep-Dive Video Structure (Tự Động Đề Xuất Theo Độ Sâu Ý Tưởng)

## 1. Cấu trúc giải phẫu chiều sâu (Không giới hạn cứng số cảnh & thời lượng)

Thay vì ép vào khung giây cố định, số cảnh (`N`) và thời lượng được tự động mở rộng theo độ phức tạp của đề tài để tránh "cưỡi ngựa xem hoa":

| Chặng | Vai trò bản chất | Nguyên tắc triển khai |
|---|---|---|
| **1. Hook (0–3s đầu)** | Phá vỡ ngón tay lướt (Frame-0 Impact) | Đưa ngay nghịch lý, nhận định phản trực giác hoặc khoảnh khắc xung đột ngay tại `t = 0.0s`. |
| **2. Bối cảnh & Gốc rễ** | Tại sao vấn đề này tồn tại? | Đặt người xem vào bối cảnh thực tế và chỉ ra nguyên nhân gốc rễ sinh ra cơ chế/hiện tượng. |
| **3. Giải phẫu từng mắt xích cơ chế** | Nó vận hành ngầm như thế nào? (`N` cảnh tùy độ sâu) | Bóc tách từng bước nhân – quả cụ thể bằng ví dụ thực tế; mỗi cảnh giải quyết trọn vẹn 1 mắt xích qua 1 cơ chế sống (Living Mechanism). |
| **4. Điểm mù & Bước ngoặt** | Đa số đang hiểu sai ở đâu? | Vạch rõ góc khuất, hiểu lầm phổ biến hoặc điều kiện ẩn gây hậu quả thực tế. |
| **5. Đúc kết & Hành động** | Quy luật mang về / CTA (nếu có brand) | Chốt lại bài học thực chiến đắt giá nhất (kèm CTA chuẩn nếu dự án có gắn `brand`). |

## 2. Hook Types

- **Phản trực giác (Myth-Buster)**: "Nhiều người nghĩ [A], nhưng thực tế cơ chế bên dưới lại là [B]."
- **Tình huống sát sườn**: "Chỉ một chi tiết nhỏ ở [X] có thể làm đảo ngược hoàn toàn [Y]."
- **Góc khuất (Curiosity)**: "Tại sao [hiện tượng quen thuộc] lại vận hành ngược hẳn với trực giác của chúng ta?"
- **Đối chiếu 2 cực (Comparison)**: "[A] và [B] trông giống hệt nhau cho đến khi bước vào thời điểm [Z]."
- **Mở vòng lặp (In Media Res)**: "Năm [mốc thời gian], một quyết định tại [bối cảnh] đã khai sinh ra quy tắc mà mọi [đối tượng] ngày nay đều phải tuân theo."

## 3. Checklist Chống "Cưỡi Ngựa Xem Hoa"

- Kịch bản đã trả lời rõ **"Tại sao"** và **"Như thế nào"** chưa, hay mới chỉ liệt kê khái niệm bề nổi?
- Mỗi mắt xích phức tạp đã được tách thành cảnh riêng với ví dụ cụ thể chưa?
- Nhìn hình vận động khi tắt tiếng (mute) có hiểu được cơ chế đang diễn ra không?
