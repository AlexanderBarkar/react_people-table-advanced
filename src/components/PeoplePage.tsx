import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { getPeople } from '../api';
import { Person } from '../types/Person';

import { PeopleFilters } from './PeopleFilters';
import { Loader } from './Loader';
import { PeopleTable } from './PeopleTable';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchParams] = useSearchParams();
  const { '*': slug } = useParams();

  useEffect(() => {
    getPeople()
      .then(setPeople)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const selectedPerson = useMemo(() => {
    if (!slug) {
      return null;
    }

    return people.find(p => p.slug === slug) || null;
  }, [people, slug]);

  const query = searchParams.get('query') || '';
  const sex = searchParams.get('sex');
  const centuries = searchParams.getAll('centuries');

  let visiblePeople = [...people];

  if (query) {
    const norm = query.toLowerCase();

    visiblePeople = visiblePeople.filter(p =>
      `${p.name} ${p.motherName || ''} ${p.fatherName || ''}`
        .toLowerCase()
        .includes(norm),
    );
  }

  if (sex) {
    visiblePeople = visiblePeople.filter(p => p.sex === sex);
  }

  if (centuries.length) {
    visiblePeople = visiblePeople.filter(p => {
      const century = Math.ceil(p.born / 100).toString();

      return centuries.includes(century);
    });
  }

  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  if (sort) {
    visiblePeople.sort((a, b) => {
      let result = 0;

      if (typeof a[sort] === 'string') {
        result = a[sort].localeCompare(b[sort]);
      } else {
        result = a[sort] - b[sort];
      }

      return order === 'desc' ? -result : result;
    });
  }

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="columns is-desktop is-flex-direction-row-reverse">
        {!isLoading && <PeopleFilters />}

        <div className="column">
          <div className="box table-container">
            {isLoading && <Loader />}

            {error && <p data-cy="peopleLoadingError">Something went wrong</p>}

            {!isLoading && !error && people.length === 0 && (
              <p data-cy="noPeopleMessage">There are no people on the server</p>
            )}

            {!isLoading && !error && people.length > 0 && (
              <PeopleTable
                people={visiblePeople}
                selectedPerson={selectedPerson}
                onSelect={() => {}}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
