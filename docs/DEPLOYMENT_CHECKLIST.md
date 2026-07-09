# Deployment Checklist

## Before deploy

- Confirm owner accepts homepage pivot
- Confirm paid Breakup Reset checkout should remain disabled
- Confirm Family Emergency Binder route should stay public
- Confirm privacy and safety copy
- Run JS syntax check
- Run browser smoke test for root and family route

## Rollback

Fast rollback options:

1. Restore files from backups/pivot-private-breakup-reset-20260709-153927.
2. Switch deployment back to the previous main branch state.
3. Revert the pivot commit after it is created.

## Do not deploy if

- Gumroad paid links point to the wrong product
- New homepage sends private message text to any third party
- Family Emergency Binder route is broken
- Safety page is missing