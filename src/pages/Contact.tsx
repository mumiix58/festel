```typescript
// Update settings access
const { settings, loading: settingsLoading } = useSettings();

// Add loading check
if (settingsLoading || !settings) {
  return (
    <div className="py-24">
      <Container>
        <div className="text-center">Laden...</div>
      </Container>
    </div>
  );
}
```