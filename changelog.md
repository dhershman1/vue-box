# Changelog

## v1.1.0

> - Complete redo of the main app
> - Stripped using eval (yay!)
> - MUCH more reliable, no picky setups or sanatizers
> - Returns a Promise now, and your tests should run inside the then
> - Keeps your Vue Object fully intact, use it just like vue does
> - Uses rollup to keep things simple (this replaced the eval)
> - Lots of code optimizations
> - Multi level components not currently supported. Still working this out.

## v1.0.1
> - Stabilized how the ending bracket could break the process, depending on if you used a semi colon or not
> - Added in tests now so you can see the module in action and see how it runs in your test files
> - Added `setThis` method to allow the user to set the this scope later if they want to call their data method
> - Some more stabilization fixes
