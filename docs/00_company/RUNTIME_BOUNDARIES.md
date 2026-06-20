# Runtime Boundaries — Paperclip / OpenClaw / Hermes

## Paperclip

Paperclip şirket yönetim katmanıdır.

Yapar:
- Org chart yönetir.
- Hedefleri takip eder.
- Governance sağlar.
- Accountability sağlar.
- Bütçe ve maliyet üst kontrolünü yapar.
- İşlerin hangi fazda olduğunu takip eder.
- Görev dağıtım mantığını düzenler.
- QR Code şirketinin ana yönetim paneli gibi çalışır.

Yapmaz:
- Komut çalıştırmaz.
- Production sistemini doğrudan değiştirmez.
- Destructive işlem yapmaz.
- Token veya credential göstermez.
- Final teknik deploy kararını tek başına vermez.

## OpenClaw

OpenClaw operasyon motorudur.

Yapar:
- Telegram routing.
- Agent execution.
- Workspace operation.
- File operations.
- Commands.
- Cron jobs.
- Reports.
- Kod, repo, server ve deploy/test operasyonları.

Yapmaz:
- Final iş kararı vermez.
- Bülent onayı olmadan destructive işlem yapmaz.
- Security policy bypass etmez.
- Tokenları açık yazmaz.

## Hermes

Hermes öğrenme ve hafıza motorudur.

Yapar:
- Learning loop.
- Lessons learned.
- Prompt improvement.
- Pattern detection.
- Skill candidates.
- Recurring problem analysis.
- Long-term memory.

Yapmaz:
- Production ortamını doğrudan değiştirmez.
- Güvenlik politikasını değiştirmez.
- Token veya credential yönetmez.
- Bülent onayı olmadan başka workflow’a bilgi taşımaz.
