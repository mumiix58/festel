```typescript
// Update getNavigationCategories call
const loadCategories = () => {
  getNavigationCategories().then(navCategories => {
    setCategories(navCategories);
  });
};
```