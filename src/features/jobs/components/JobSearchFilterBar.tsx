import React, { useState, useEffect } from 'react';
import { Search, MapPin, RotateCcw } from 'lucide-react';
import { JobFilterParams, EmploymentType, WorkMode } from '../types';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface JobSearchFilterBarProps {
  filters: JobFilterParams;
  onFilterChange: (newFilters: JobFilterParams) => void;
}

export const JobSearchFilterBar: React.FC<JobSearchFilterBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [locationTerm, setLocationTerm] = useState(filters.location || '');

  // Debounce search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search || locationTerm !== filters.location) {
        onFilterChange({
          ...filters,
          search: searchTerm || undefined,
          location: locationTerm || undefined,
          page: 1,
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, locationTerm, filters, onFilterChange]);

  const handleReset = () => {
    setSearchTerm('');
    setLocationTerm('');
    onFilterChange({ page: 1, pageSize: 20 });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5">
          <Input
            placeholder="Search job title, skills, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="md:col-span-4">
          <Input
            placeholder="Location (e.g. Remote, Bengaluru)..."
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
            leftIcon={<MapPin className="w-4 h-4" />}
          />
        </div>

        <div className="md:col-span-3 flex items-center gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select
          label="Employment Type"
          value={filters.employmentType || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              employmentType: (e.target.value as EmploymentType) || undefined,
              page: 1,
            })
          }
          options={[
            { label: 'All Employment Types', value: '' },
            { label: 'Full Time', value: 'FullTime' },
            { label: 'Part Time', value: 'PartTime' },
            { label: 'Contract', value: 'Contract' },
            { label: 'Internship', value: 'Internship' },
          ]}
        />

        <Select
          label="Work Mode"
          value={filters.workMode || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              workMode: (e.target.value as WorkMode) || undefined,
              page: 1,
            })
          }
          options={[
            { label: 'All Work Modes', value: '' },
            { label: 'Remote', value: 'Remote' },
            { label: 'Hybrid', value: 'Hybrid' },
            { label: 'Onsite', value: 'Onsite' },
          ]}
        />

        <Select
          label="Sort By"
          value={filters.sort || '-publishedAt'}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value, page: 1 })}
          options={[
            { label: 'Most Recent', value: '-publishedAt' },
            { label: 'Oldest', value: 'publishedAt' },
            { label: 'Title (A-Z)', value: 'title' },
          ]}
        />
      </div>
    </div>
  );
};
