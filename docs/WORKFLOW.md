# Quy trình bounty ai-excited-01

Nguồn đã đọc ngày 16/11/2026:
- https://make.fun/skill.md (phiên bản 1.5.189)
- https://make.fun/bounty/ai-excited-01
- https://make.fun/api/competitions/ai-excited-01/requirements
- Dev kit: https://make.fun/c/ai-excited-01/kit

## Tài khoản và quyền

Agent đã kết nối và xác minh qua `GET /api/agents/me`: **rice-777**.
Tên agent: rice-777-codex. Quyền được cấp: enter, comment. Quyền tài chính không bật.
Không lưu API key hoặc private key trong Git. Địa chỉ ví công khai của agent không phải private key; chỉ thêm `.makefun/owner.json` sau khi đã xác minh account.

Repo `vantam3/make-fun` được tạo 16/11/2026 lúc 09:42:36 UTC, sau thời điểm mở 15/11/2026 lúc 23:00 UTC. Hiện repo riêng tư; cần duyệt công khai trước khi nộp bằng GitHub.

## Sản phẩm và chấm điểm

- Chương trình ghi đúng một ảnh vào `/output/entry.png` (PNG hoặc JPEG hợp lệ).
- Tối đa 1.048.576 byte, chiều rộng và chiều cao không quá 1.024 px.
- Root entrypoint: `main.py` (Python 3.13) hoặc `main.ts` (Node 22), chỉ thư viện chuẩn; không có bước cài dependency.
- Chạy offline, repo chỉ đọc ở `/bot`, chỉ `/output` ghi được; 1 CPU, 512 MB, 64 tiến trình, 60 giây. Hai lần chạy phải cho cùng byte.
- Có giấy phép OSI và ba badge make.fun thật trong README.
- Nếu GitHub của account không khớp owner repo, commit `.makefun/owner.json` chứa địa chỉ ví công khai thuộc account.
- Ưu tiên của giám khảo: sức cuốn hút, bất ngờ, chuyển động, độ hoàn thiện, đọc rõ ở khoảng 300 px.
- 20 vị trí nhận tổng 250 USDC; hạng nhất 50, nhì 35, ba 25, hạng 4–10 mỗi hạng 10, hạng 11–20 mỗi hạng 7. Một người chỉ lấy một vị trí. Không bảo đảm thắng.
- Ảnh nhận thưởng cấp quyền sử dụng không độc quyền, toàn cầu, vĩnh viễn và miễn phí cho make.fun theo luật bounty; cần người dùng xem điều khoản này khi duyệt nộp.

## Ghi phiên bắt buộc

1. Lấy dev kit ngoài repo; kiểm tra SHA-256 các file theo `kit.json`.
2. Đặt `MAKEFUN_CREDENTIALS` và `MAKEFUN_RECORDINGS_STATE` ở thư mục riêng ngoài repo, quyền file 600 và thư mục 700. Không đổi HOME hoặc CODEX_HOME.
3. Khởi động `record --competition ai-excited-01 --source <repo>` từ kit, rồi bắt đầu một phiên agent mới. Có thể dùng cách kit chỉ dẫn: `record ... -- codex exec --sandbox workspace-write <task>`.
4. Recorder phải tìm được session gốc có timestamps và usage/model thật. Kiểm tra ngay sau khi bắt đầu; nếu không ghi được, dừng và xử lý trước khi viết mã dự thi.
5. Bằng chứng cần có: ít nhất 5 lượt assistant có text/thinking; ít nhất một file mã được cải tiến thực chất qua 2 lượt ghi/sửa; ít nhất 30% dòng được agent viết, tối đa 40% dòng text không có bằng chứng; model của usage phải có giá trong API pricing.
6. Không nhập lại mã có sẵn rồi coi là tự viết; không chỉnh log, timestamp, model ID hoặc token usage. Không dùng transcript bàn giao thay cho log thật để thi giải có thưởng.
7. Dừng recorder khi hoàn tất để seal; giữ ID và receipt, kiểm tra seal thành công. Nếu seal lỗi, dùng `record --finish <id>` trên cùng máy và cùng môi trường; không coi lỗi là thành công.
8. Giữ nguyên prompt gốc của người dùng. Run record mô tả trung thực nguồn prompt, harness/version, model/provider/effort, MCP đã dùng; hướng dẫn/system prompt không thể cung cấp phải ghi withheld cùng lý do, không dựng lại nội dung ẩn. Run record bắt buộc từ 17/11/2026 00:00 UTC; nên chuẩn bị đầy đủ ngay.

Kit hiện đặt ngoài repo ở `/workspace/work/makefun/ai-excited-01-kit`. State bí mật ở `/workspace/work/makefun/private`, không phải thư mục Git. Node CLI trong môi trường Cloud cần dùng proxy sẵn có; `node --use-env-proxy` đã kết nối thành công.

## Kiểm tra và cổng duyệt

- Chạy chương trình hai lần; so SHA-256, kiểm tra cấu trúc ảnh, checksum PNG, kích thước và dung lượng.
- Xem ảnh nguyên cỡ và ảnh thu nhỏ 300 px; sửa điểm yếu nhìn thấy, lưu bằng chứng.
- Dùng `bundle --dry-run` và `check` theo help của kit để kiểm tra session và bài. Không gọi submit để thử nghiệm khi chưa được duyệt.
- Quét file staged và lịch sử commit để tránh bí mật; chỉ đưa log đã được kit xử lý vào nơi quy định.
- Chuẩn bị full commit SHA, recording ID đã seal, title, ảnh và kết quả kiểm tra cho người dùng xem.
- Xin duyệt công khai repo và nộp đúng commit. Không tự submit, claim, bet, deposit, trả phí, chuyển tiền hoặc ký giao dịch tài chính.
- Sau khi được duyệt nộp mới theo dõi kết quả thật; kết quả local không thay thế điểm giám khảo.

## Thời gian và quota

Hạn nộp từ API requirements: **17/11/2026 06:00 giờ Việt Nam (16/11/2026 23:00 UTC)**. Không nhầm với hạn commit danh sách escrow 23:10 UTC.
Final window bắt đầu 06:10 giờ Việt Nam. Quota công bố tối đa 10 lượt/ngày UTC và 20 lượt/account; mức theo vùng hoặc uy tín có thể thấp hơn, lượt bị từ chối vẫn tính. Kiểm tra quota thật trước lần nộp được duyệt.
