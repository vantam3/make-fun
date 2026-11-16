# Thiết lập mới trực tiếp từ GitHub

## Cách làm người dùng đã chọn

Tiếp tục trên repo `vantam3/make-fun`, nhánh `bounty/ai-excited-01`. Agent chỉnh sửa bằng kết nối GitHub; không yêu cầu người dùng clone hoặc cài bộ công cụ trên laptop. Môi trường Cloud cũ đang offline và không được coi là môi trường chạy hiện tại. Không có công cụ xóa hoặc tạo lại Cloud Codex trong phiên chat đã kiểm tra; không báo đã xóa hoặc khởi tạo máy khi chưa có xác nhận.

Cấu hình `.devcontainer/devcontainer.json` chuẩn bị một môi trường mới dùng được trên dịch vụ hỗ trợ Dev Containers, trong đó có GitHub Codespaces qua trình duyệt. Cấu hình dùng Debian Bookworm, Node 22, Python 3.13 và cài Codex CLI khi tạo container. Không sao chép credentials hoặc private keys từ máy cũ; không có đường dẫn `/workspace/work/...` cố định, không thay HOME hoặc CODEX_HOME.

**Trạng thái:** cấu hình được lưu qua GitHub; chưa khởi tạo hay kiểm thử container. File cấu hình không tự tạo một máy đang chạy. Việc tạo Codespace cần phiên GitHub có quyền tạo; công cụ GitHub đang có của agent chưa cung cấp thao tác đó. Không khởi tạo tài nguyên trả phí hoặc chấp thuận phí khi người dùng chưa cho phép.

## Bước tiếp tục của agent khi có môi trường mới

1. Đọc `AGENTS.md` và xác minh đúng branch. Người dùng đã cho phép hoàn thiện và nộp không cần vòng review; mọi khoản phí và giao dịch tài chính vẫn cần phê duyệt riêng.
2. Kiểm tra phiên bản Node, Python và Codex thật; xác minh truy cập mạng bằng client thực tế. Nếu bước cài CLI lỗi, chẩn đoán lỗi thật, không báo môi trường đã sẵn sàng.
3. Đọc lại https://make.fun/skill.md, bounty và API requirements hiện tại, kiểm tra hạn nộp trước khi làm. Các hạn trong tài liệu chuẩn bị là lịch đã đọc, không thay cho trạng thái live.
4. Giữ dev kit, keypair, credentials, recording state và logs gốc ở thư mục ngoài Git. Kiểm tra quyền thư mục/file và ignore rules; không in khóa hoặc đưa auth vào prompt.
5. Kiểm tra đăng nhập Codex. Tạo kết nối agent mới bằng `makefun login` nếu môi trường mới không có khóa hợp lệ; gửi link duyệt thật cho người dùng, xác minh lại đúng `rice-777`. Không tự register tài khoản khác và không gộp tài khoản.
6. Bật recorder chính thức trước một phiên coding mới. Xác minh log, timestamps và usage thật được ghi nhận trước khi viết mã. Việc chỉnh file qua GitHub và lịch sử commit không thay thế bản ghi live.
7. Thực hiện bài, preview và kiểm thử theo `docs/WORKFLOW.md`. Chỉ sửa pre-existing files khi có thay đổi thực chất; không dựng hoặc chỉnh bằng chứng để qua gate. Nếu dùng ví agent mới, cập nhật proof bằng địa chỉ công khai đã xác minh.
8. Seal thành công và kiểm tra đủ điều kiện rồi mới nộp. Báo URL entry và xác nhận từ make.fun khi nộp thành công; không gọi thay đổi repo là đã nộp.

## Phạm vi của các tài liệu khác

`docs/LOCAL-HANDOFF.md` giữ lịch sử sự cố và trạng thái đã xác minh. Hướng dẫn clone trên laptop trong tài liệu cũ không còn là phương án người dùng chọn. `docs/WORKFLOW.md` mô tả luật cuộc thi; quyền người dùng mới nhất trong `AGENTS.md` có ưu tiên cao hơn cổng review cũ.

Không có bài dự thi hoặc ảnh hoàn chỉnh tại thời điểm thiết lập này. Chưa có build recording đủ điều kiện và chưa có submission được xác nhận.
