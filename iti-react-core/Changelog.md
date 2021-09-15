# 3.0.0

- Rename query hooks to avoid name collision with `react-query`:  
	- `useQuery` -> `useSimpleQuery`  
	- `useParameterlessQuery` -> `useSimpleParameterlessQuery`  
	- `useAutoRefreshQuery` -> `useSimpleAutoRefreshQuery`  
	- `useParameterlessAutoRefreshQuery` -> `useSimpleParameterlessAutoRefreshQuery`  
- Remove `nullToEmpty`. Use `??` instead.  
- Remove `selectFiltersByExcludingProperties`. Use Lodash `omit` instead.  
