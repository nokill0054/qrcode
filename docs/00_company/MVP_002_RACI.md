# MVP-002 RACI — Real User, Stable QR Slug, Profile / Redirect Mode

## Task

QR Code SaaS ürününü test demo yapısından gerçek kullanıcı, kalıcı QR slug ve profil/redirect modu olan MVP yapısına taşımak.

## Responsible

- qr-backend-agent
- qr-frontend-mobile-agent
- qr-database-api-agent

## Accountable

- qr-cto-agent

## Consulted

- qr-product-manager-agent
- qr-security-agent
- qr-qa-agent
- qr-token-controller-agent
- qr-approval-guard-agent
- qr-hermes-learning-agent

## Informed

- qr-coordinator-agent
- Paperclip
- Bülent

## Final Approval

- Bülent

## Blocking Conditions

- Bülent onayı gerektiren kritik işlem belirsizse işlem durur.
- Backup alınmadan database yapısı değiştirilecekse işlem durur.
- Token, secret veya credential açık gösterilecekse işlem durur.
- QR slug kalıcılığı bozulacaksa işlem durur.
- Test planı olmadan release yapılacaksa işlem durur.
- Security alarmı varsa işlem durur.
- QA testleri başarısızsa işlem durur.
- Token / maliyet sıçraması varsa işlem durur.

## Stop-the-Line Authority

- Bülent
- qr-security-agent
- qr-qa-agent
- qr-token-controller-agent
- qr-approval-guard-agent
