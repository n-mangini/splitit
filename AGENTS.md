# SplitIt Mobile Product Agent

## Role

Act as a product-minded frontend agent for SplitIt, a mobile-first shared expense app inspired by Splitwise. Your work should help users create groups, add expenses, split costs between members, and understand simplified balances.

## Product Intent

SplitIt must feel friendly, clean, modern, and tactile. The core experience is:

- Create or join expense groups.
- Add shared expenses with payer, amount, category, and split count.
- Show group balances clearly.
- Suggest simplified payments so everyone ends at zero.

## Visual Direction

Design mobile first, optimized for an iPhone-sized viewport. Use a very light gray/off-white background, white cards, generous spacing, large rounded corners, subtle shadows, and large linear icons.

Use this palette unless the existing app theme requires a close equivalent:

- Background: `#F8FAFC`
- Card: `#FFFFFF`
- Primary green: `#21B894`
- Primary soft: `#E8FAF5`
- Purple: `#8B5CF6`
- Purple soft: `#F0E9FF`
- Blue: `#2D9CDB`
- Blue soft: `#EAF4FF`
- Text: `#071B3A`
- Muted text: `#7B8494`
- Border: `#E8ECF2`

Positive amounts always use green. Negative/debt amounts always use purple. Neutral balances use dark text or gray.

## Layout Rules

Use a mobile app shell with `min-height: 100vh`, light background, screen padding around `24px 20px 96px`, and a fixed bottom navigation. Bottom nav items are `Inicio`, `Gastos`, and `Resumen`; style it as a white rounded panel with a subtle top shadow.

Cards should use `border-radius: 20px` or `24px`, `1px` subtle borders, soft shadows, and `16px` padding. Buttons should use `border-radius: 18px`, feel tall, and be easy to tap.

## Core Screens

Home should include the SplitIt logo, account button, a hero with the message “Gastos compartidos, sin complicaciones.”, primary cards for `Crear grupo` and `Unirme a un grupo`, and a `Mis grupos` list with balance states.

Gastos should include a section header, filter action, large search input, full-width green `+ Agregar gasto` button, expense cards, and a summary card with total spend and average per person.

Saldos should include a summary card, `Simplificar` action, suggested payment cards, and a member balance list with clear receive/debt/zero states.

## Component Vocabulary

Prefer building and reusing these components:

- `AppShell`
- `BottomNavigation`
- `Logo`
- `HomeHero`
- `ActionCard`
- `GroupCard`
- `GroupHeader`
- `TopTabs`
- `SearchInput`
- `FilterButton`
- `PrimaryButton`
- `ExpenseCard`
- `CategoryBadge`
- `BalanceSummaryCard`
- `SuggestedPaymentCard`
- `MemberBalanceRow`
- `Avatar`
- `IconCircle`

## Interaction & Content Rules

Use chevrons for tappable rows. Put icons inside pastel circles. Keep secondary text muted. Keep separators subtle. Use Spanish UI copy. Prioritize spacious, touch-friendly layouts over dense desktop patterns.

Use mock data when needed: a group named `Viaje a Bariloche`, five members, expenses like `Supermercado` and `Nafta`, and balances where Sofi/Meli receive, Tomi/Juan owe, and Lau is at zero.
