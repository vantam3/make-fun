# Tiếp tục trên laptop ở nhà

## Mục tiêu và quyền hiện tại

Hoàn thành và nộp bài bounty https://make.fun/bounty/ai-excited-01 cho **@rice-777**. Trả lời người dùng bằng tiếng Việt. Người dùng đã cho phép tự hoàn thiện và nộp, không cần review thêm. Được công khai repo nếu việc nộp yêu cầu. Chưa cho phép trả phí hoặc thực hiện giao dịch tài chính. Không commit thông tin xác thực.

## Những gì đã xác minh

- GitHub repo: vantam3/make-fun, nhánh chuẩn bị: bounty/ai-excited-01. Repo vẫn riêng tư ở lần kiểm tra cuối.
- Đã kết nối agent rice-777-codex bằng makefun login và kiểm tra API agents/me trả handle rice-777. Quyền enter, comment; không có quyền tài chính.
- API key và private key được lưu ngoài Git trên môi trường cũ. Chúng không đi theo clone. Không yêu cầu người dùng dán khóa vào chat và không đưa khóa qua Git.
- Repo được tạo sau thời điểm bounty mở; README có ba badge thật, có giấy phép và file chứng minh địa chỉ ví công khai.
- Chưa tạo mã dự thi, chưa tạo ảnh hoàn chỉnh, chưa có bản ghi build đủ điều kiện, chưa nộp bài nào. Các recording thử khởi động lỗi không phải bằng chứng cho bài hoàn chỉnh.

## Lỗi đã gặp, phân biệt với giả thuyết

1. GitHub tạo repo trả 403 do quyền integration; người dùng đã tự tạo repo và cấp quyền. Clone và push nhánh chuẩn bị thành công. Đây không còn là lỗi chặn.
2. Node fetch ban đầu không dùng proxy của môi trường Cloud; dùng proxy môi trường thì login make.fun thành công.
3. Codex CLI ban đầu trả 401. Người dùng đã bật device code sign-in trong ChatGPT Security và duyệt đăng nhập; CLI báo Successfully logged in trên môi trường cũ. Không suy ra laptop đã đăng nhập.
4. Phiên Codex lồng trong Cloud không chạy được shell: `error building bubblewrap command: app-server socket directory must be a user-owned directory with mode 0700`. Đường socket bị sandbox ngoài che; không chmod, mở khóa hoặc bỏ kiểm soát bảo vệ để né lỗi. Đã thử chẩn đoán bằng cơ chế escalation chính thức, nhưng chưa đọc được kết quả trước lúc mất kết nối.
5. Lần kiểm tra môi trường gần nhất báo observed_phase running nhưng connectivity offline. Không có retained diagnostic records. Chưa xác định được nguyên nhân gốc của mất kết nối; không khẳng định do việc tắt máy văn phòng.

## Cách agent tiếp tục khi laptop được gắn vào phiên

1. Xác minh cwd, hệ điều hành, nhánh Git và trạng thái làm việc; giữ mọi thay đổi chưa commit. Lấy nhánh bounty/ai-excited-01 nếu chưa có. Không cần bật lại máy văn phòng để lấy phần đã push.
2. Đọc AGENTS.md, hướng dẫn chính thức https://make.fun/skill.md và requirements hiện tại https://make.fun/api/competitions/ai-excited-01/requirements. Xác minh bounty còn nhận bài. Hạn được công bố ở lần đọc trước: 2026-11-16 23:00 UTC, tức 06:00 ngày 17/11/2026 giờ Việt Nam; không coi bản ghi cũ là trạng thái hiện tại.
3. Kiểm tra đăng nhập Codex và session logs thật trên laptop. Nếu cần đăng nhập, dùng luồng chính thức; không yêu cầu mật khẩu/token trong chat. Không giả định lỗi sandbox Cloud sẽ lặp lại trên máy mới.
4. Nếu laptop không có credentials make.fun hợp lệ, tạo keypair mới ngoài repo, quyền chỉ chủ máy đọc được; dùng makefun login để người dùng duyệt vào đúng rice-777. Không register tài khoản mới, không gộp tài khoản, không bật quyền tài chính. Sau duyệt, xác minh lại account bằng API.
5. Lấy kit chính thức ngoài repo, kiểm tra checksum theo kit.json. Bật makefun record trước một phiên coding mới được hỗ trợ và kiểm tra recorder nhận log. Phiên thiết lập này không tự trở thành phiên build hợp lệ. Không viết mã dự thi cho đến khi ghi phiên hoạt động.
6. Làm ảnh nguyên bản, thử và sửa thực chất. Ảnh PNG/JPEG tối đa 1024x1024 và 1 MiB; root main.py hoặc main.ts chỉ dùng thư viện chuẩn, chạy offline, hai lần cho cùng byte, dưới giới hạn sandbox. Xem ảnh 300px và kiểm tra cấu trúc, checksum, dung lượng, runtime và tính xác định.
7. Tuân thủ toàn bộ transcript gate: tối thiểu 5 lượt assistant có text/thinking, chỉnh sửa thực chất trong các lượt khác nhau, tỷ lệ tác giả, model/usage có thể định giá, timestamps và fingerprints thật. Không sửa log. Các file chuẩn bị có trước recording phải được xử lý theo check của kit, không giả nhận tác giả: chỉ sửa khi có thay đổi thực chất cần thiết hoặc loại file không cần khỏi snapshot dự thi, giữ lịch sử chuẩn bị.
8. Nếu dùng ví agent mới, cập nhật .makefun/owner.json bằng địa chỉ công khai đã xác minh. Không đưa keypair vào file này.
9. Seal recorder thành công, giữ receipt/ID và chuẩn bị run record trung thực. Chạy kiểm tra kit trước nộp. Quét bí mật trong Git và lịch sử trước khi công khai repo.
10. Khi bài và recordings đạt yêu cầu, tự nộp đúng commit theo quyền người dùng đã cấp. Nếu API yêu cầu phí hoặc giao dịch tài chính, dừng bước đó và xin phép riêng. Theo dõi kết quả thật và báo URL entry, commit, recording ID, kết quả/giới hạn; không báo nộp thành công nếu chưa có xác nhận từ server.

## Bài học cần giữ

Giữ bằng chứng thật, phân biệt lỗi đã giải quyết với lỗi hiện tại. Không hứa rằng công việc vẫn chạy khi Cloud offline hoặc cuộc trò chuyện đã dừng. Không tạo điểm chấm giả và không bảo đảm giải thưởng. Mọi bài học cải thiện chất lượng cần có quan sát hoặc kết quả kiểm tra để hỗ trợ.
