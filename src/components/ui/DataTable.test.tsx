import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataTable, Column } from './DataTable';

interface TestItem extends Record<string, unknown> {
  id: string;
  name: string;
  role: string;
}

describe('DataTable Component', () => {
  const sampleData: TestItem[] = [
    { id: '1', name: 'Alice Smith', role: 'Candidate' },
    { id: '2', name: 'Bob Jones', role: 'Recruiter' },
  ];

  const columns: Column<TestItem>[] = [
    { header: 'Name', accessor: (item) => item.name },
    { header: 'Role', accessor: (item) => item.role },
  ];

  it('renders table headers and data rows correctly', () => {
    render(
      <DataTable
        columns={columns}
        data={sampleData}
        keyExtractor={(item) => item.id}
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('renders loading skeleton when isLoading is true', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        isLoading={true}
        keyExtractor={(item) => item.id}
      />
    );

    expect(screen.getByTestId('data-table-skeleton')).toBeInTheDocument();
  });

  it('renders empty message when data is empty', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        emptyMessage="No candidates found"
        keyExtractor={(item) => item.id}
      />
    );

    expect(screen.getByText('No candidates found')).toBeInTheDocument();
  });
});
