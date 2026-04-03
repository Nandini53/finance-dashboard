# Finance Dashboard

A personal finance dashboard that lets you track income, expenses, 
and spending patterns. Built with React and Vite as part of a 
frontend development assignment.

Live demo: finance-dashb5.netlify.app
GitHub: https://github.com/Nandini53/finance-dashboard


## What this project does

Finance dashboard gives you a clear picture of your financial activity across 
three sections:

- A dashboard overview with summary numbers and charts
- A transactions list you can search, filter, and sort
- An insights page that highlights spending patterns

You can also switch between Viewer and Admin roles to see how the 
UI changes based on access level.


## My approach

I kept the architecture as simple and readable as possible. All the 
main state lives in one place (Dashboard.jsx) and flows down to 
components as props. I deliberately avoided heavy libraries — the 
charts are hand-written SVG, and state management is plain useState 
and useMemo from React.

The reason I went this direction is that I wanted the code to be 
easy to follow and easy to change. Adding a library like Redux or 
Recharts would have been faster in some ways, but it would also 
mean more abstraction hiding what is actually happening.

I also built in dark mode and localStorage persistence because they 
are small additions that make the experience feel complete rather 
than like a prototype.

## Features

### Dashboard overview
- Four summary cards showing net balance, total income, 
  total expenses, and savings rate
- A monthly bar chart comparing income vs expenses 
  across January, February, and March
- A donut chart breaking down spending by category
- A recent activity list showing the five latest transactions

### Transactions
- Full list of all transactions with date, description, 
  category, type, and amount
- Search bar that filters by description or category
- Filter by transaction type (income or expense)
- Filter by category
- Sort by date or amount in either direction
- Export the current filtered list to a CSV file

### Role based UI
- Viewer role shows all data but no edit controls
- Admin role adds a banner at the top and unlocks the ability 
  to add new transactions, edit existing ones, and delete them
- Switch roles using the dropdown in the navigation bar
- No backend or authentication — this is a frontend simulation

### Insights
- Highlights the biggest spending category
- Compares March expenses to February (month over month)
- Shows the average transaction value across all entries
- Displays the overall savings rate as a percentage of income
- Category breakdown with visual progress bars
- Month by month summary table

### Dark mode
- Toggle between light and dark theme using the button 
  in the top right corner of the nav
- All components respond to the theme including charts, 
  modals, cards, and the transaction list

### Data persistence
- All transactions are saved to localStorage
- Adding, editing, or deleting a transaction persists 
  across page refreshes
- If localStorage is empty the app loads with mock data 
  so there is always something to look at

  ## Author

Nandini Bhatia
email - bhatianandini6@gmail.com