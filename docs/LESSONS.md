# Bài học dùng lại

Đây là ghi chú trong repo để các phiên sau đọc lại, không phải lời hứa tự ghi nhớ ngoài dự án.

| Bài học | Bằng chứng hiện có | Cách áp dụng lần sau |
| --- | --- | --- |
| Kiểm tra quyền bằng thao tác thật | Tạo repo bị GitHub từ chối 403; sau khi người dùng cấp repo mới, clone thành công | Phân biệt quyền đọc/ghi repo với quyền tạo repo |
| Xác minh account sau duyệt | makefun login và API agents/me trả handle rice-777 | Không suy ra account chỉ từ việc người dùng mở link |
| Kết nối mạng phụ thuộc client | curl hoạt động; Node fetch ban đầu lỗi; dùng proxy môi trường thì login thành công | Giữ cấu hình proxy/CA và kiểm tra client thực tế |
| Luật ghi phiên quyết định đủ điều kiện | Requirements yêu cầu live recording trước phiên mới, không nhận transcript upload | Kiểm tra recorder trước khi viết mã |
| Ưu tiên tiêu chí có trọng số cao | Luật xếp sức cuốn hút và bất ngờ trước craft và chi tiết | Chọn một ý tưởng mạnh; kiểm tra bản thu nhỏ |
| Giữ quyền duyệt ở hành động cuối | Người dùng yêu cầu không submit hoặc giao dịch khi chưa duyệt | Chuẩn bị ảnh, SHA và kết quả kiểm tra trước khi hỏi duyệt |

Sau mỗi vòng thực hiện, bổ sung: mục tiêu, lỗi quan sát được, thay đổi đã làm, bằng chứng trước/sau và điều chưa xác minh. Không gán thành công cho một thay đổi chỉ dựa vào cảm giác; không ghi điểm make.fun nếu chưa có kết quả thật.
