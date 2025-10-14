# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A DHIS2 web application for generating WHO Data Quality Annual Reports by HISP Rwanda. The app analyzes health data quality across four domains: completeness of reporting, internal consistency, external comparison, and consistency of population data.

Built with React and the DHIS2 Application Platform, using DHIS2 Analytics API for data retrieval and Highcharts for visualizations.

## Technical Documentation

[Data Quality App - Technical Documentation.pdf](./Data Quality App - Technical Documentation.pdf)

This is the **official technical specification** that was used to build this application. It contains:

-   Detailed calculation formulas for all four data quality sections
-   Quality threshold definitions and scoring methodology
-   Data element and indicator specifications
-   Report structure and layout requirements
-   Business logic and validation rules

**Note that**:

-   The instance used in this documentaion ('https://demos.dhis2.org/dq/') is the demo instance.

**IMPORTANT**: Always refer to this document when:

-   Implementing or modifying calculation logic
-   Adding new quality metrics or indicators
-   Debugging data quality assessments
-   Understanding the WHO data quality framework
-   Making changes to report sections or scoring algorithms

**Warning**: This documentation is correct, but in some unusual cases it might refer/used incorrect logic feel free to flag it and suggest correct ones.

## Development Commands

```bash
# Start development server (runs on localhost:3000)
yarn start

# Run all tests
yarn test

# Build production bundle (outputs .zip to build/bundle/)
yarn build

# Deploy to DHIS2 instance (requires yarn build first)
yarn deploy

# Lint code
yarn lint

# Auto-format code
yarn format
```

## Data Store Configuration

The app stores configurations in DHIS2's data store API. During development, to avoid conflicts with other developers:

1. Create a `.env.local` file in the project root
2. Set `REACT_APP_DHIS2_APP_DATASTORE_KEY=your-custom-key`
3. This overrides the default `configurations` key (used in production)

The data store path is `who-dqa/{key}` where `{key}` is determined by the environment variable or defaults to `configurations`. See `src/utils/configurations/constants.js:3-7`.

## Architecture

### Application Structure

Two main pages with React Router (HashRouter):

-   **Annual Report** (`/`) - Main reporting interface
-   **Configurations** (`/configurations`) - Admin interface for configuring report parameters

### State Management

The app uses React Context with a reducer pattern (not `useReducer` directly, but follows the same pattern):

**ConfigurationsProvider** (`src/utils/configurations/configurationsContext.js:33-63`)

-   Fetches configurations once on mount from DHIS2 data store
-   Maintains configurations in local state
-   Provides three separate contexts to optimize re-renders:
    -   `ConfigurationsContext` - read-only access to configurations
    -   `SetConfigurationsContext` - function to update configurations
    -   `RefetchConfigurationsContext` - function to refetch from server (legacy, should be phased out)

**Configurations Reducer** (`src/utils/configurations/configurationsReducer.js`)

-   Pure function that handles all configuration updates
-   Action types include: `CREATE_NUMERATOR`, `UPDATE_NUMERATOR`, `DELETE_NUMERATOR`, `CREATE_NUMERATOR_GROUP`, `CREATE_NUMERATOR_RELATION`, `CREATE_DENOMINATOR`, `CREATE_DENOMINATOR_RELATION`, `CREATE_EXTERNAL_RELATION`, etc.
-   Each action returns a new configurations object (immutable updates)
-   Auto-generates unique codes for new items (e.g., 'C001', 'G001', 'R001')

**UserProvider** (`src/utils/current-user/userContext.js`)

-   Manages current user state and authorization

### Configuration Entities

The configurations object contains:

-   **numerators** - Data elements/indicators to track (with code prefix 'C' for custom, 'D' for default)
-   **groups** - Logical groupings of numerators (code prefix 'G')
-   **numeratorRelations** - Relationships between numerators for consistency checks (code prefix 'R')
-   **denominators** - Population data denominators (code prefix 'P')
-   **denominatorRelations** - Relationships for population consistency (code prefix 'PR')
-   **externalRelations** - External data comparisons (code prefix 'ER')
-   **dataSets** - DHIS2 data sets for completeness tracking
-   **coreIndicators** - List of core indicator codes

### Report Structure

The annual report has four sections corresponding to WHO data quality domains:

**Section 1 - Completeness of Reporting** (`src/components/annual-report/section1/`)

-   Analyzes completeness and timeliness of data set reporting
-   Requires configured numerators and data sets

**Section 2 - Internal Consistency** (`src/components/annual-report/section2/`)

-   Checks consistency between related numerators
-   Five subsections (a-e) with different calculation methods
-   Uses `useSectionTwoData.js` hook for data fetching

**Section 3 - External Comparison** (`src/components/annual-report/section3/`)

-   Compares internal data with external sources
-   Requires configured external relations

**Section 4 - Consistency of Population Data** (`src/components/annual-report/section4/`)

-   Validates population denominator consistency
-   Requires configured denominator relations

Each section follows the pattern:

-   `SectionX.js` - Main component
-   `useSectionXData.js` - Data fetching hook
-   `sectionXCalculations.js` - Data processing/calculations
-   `sectionXChartGenerator.js` - Highcharts configuration

### Key Patterns

**Updating Configurations**:

```javascript
const dispatch = useConfigurationsDispatch()
dispatch({
    type: CREATE_NUMERATOR,
    payload: {
        newNumeratorData,
        groupsContainingNumerator,
        dataSetsContainingNumerator,
    },
})
```

**Reading Configurations**:

```javascript
const configurations = useConfigurations()
```

**Legacy Pattern (avoid in new code)**:

```javascript
const refetch = useRefetchConfigurations() // Should be replaced with dispatch pattern
```

### Printing Functionality

The app supports printing reports via `window.print()`. Special handling in `src/pages/AnnualReport.js:26-32`:

-   Sets `printing` state flag
-   Waits 1 second for Highcharts to reflow before calling `print()`
-   Charts respond to printing state for proper sizing

### Data Fetching

Uses `@dhis2/app-runtime` for DHIS2 API calls:

-   `useDataEngine()` - Hook for making queries/mutations
-   Analytics API queries for report data
-   Data store API for configurations
-   Metadata API for DHIS2 objects (data elements, indicators, org units)

### Authorization

The Configurations page checks user authorization via `useUserContext().isAuthorized` (`src/pages/Configurations.js:15`). Unauthorized users see a warning message.

## Configuration Tabs

Seven configuration sections in `src/components/config-tabs/`:

1. Numerators - Define data elements/indicators to track
2. Numerator groups - Organize numerators
3. Numerator relations - Define consistency checks
4. Numerator quality parameters - Set thresholds for quality metrics
5. Denominators - Define population denominators
6. Denominator relations - Define population consistency checks
7. External data comparison - Configure external data sources

## Important Notes

-   The app auto-migrates from old app settings (`dataQualityTool/settings`) if found
-   Default configurations loaded from `src/data/defaultConfigurations.json` if no prior settings exist
-   All new configurations auto-update `lastUpdated` timestamp
-   Custom numerators get auto-generated codes starting with 'C'
-   Data store sharing is automatically set to public read-only (`r-------`)
-   Figma designs available at: https://www.figma.com/proto/r5H9Zq1dAeJ0PXyKmMCJgG/

## Testing

Tests use DHIS2 CLI App Scripts test runner. Located in `src/**/*.test.js` files.
