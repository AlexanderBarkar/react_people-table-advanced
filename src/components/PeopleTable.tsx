/* eslint-disable jsx-a11y/control-has-associated-label */
import { Link, useSearchParams } from 'react-router-dom';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  selectedPerson: Person | null;
  onSelect: (person: Person) => void;
};

export const PeopleTable: React.FC<Props> = ({
  people,
  selectedPerson,
  onSelect,
}) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  const buildTo = (pathname: string) =>
    search ? { pathname, search } : { pathname };

  const getNameColor = (sex: string) =>
    sex === 'f' ? 'has-text-danger' : 'has-text-link';

  const findPerson = (name: string | null) => people.find(p => p.name === name);

  return (
    <table className="table is-fullwidth" data-cy="peopleTable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Sex</th>
          <th>Born</th>
          <th>Died</th>
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {people.map(person => {
          const isSelected = selectedPerson?.slug === person.slug;

          const mother = findPerson(person.motherName);
          const father = findPerson(person.fatherName);

          return (
            <tr
              key={person.slug}
              data-cy="person"
              className={isSelected ? 'has-background-warning' : ''}
              onClick={() => onSelect(person)}
            >
              {/* NAME */}
              <td>
                <Link
                  to={buildTo(`/people/${person.slug}`)}
                  className={getNameColor(person.sex)}
                >
                  {person.name}
                </Link>
              </td>

              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>{person.died}</td>

              {/* MOTHER */}
              <td>
                {mother ? (
                  <Link
                    to={buildTo(`/people/${mother.slug}`)}
                    className="has-text-danger"
                  >
                    {mother.name}
                  </Link>
                ) : (
                  person.motherName || '-'
                )}
              </td>

              {/* FATHER */}
              <td>
                {father ? (
                  <Link to={buildTo(`/people/${father.slug}`)}>
                    {father.name}
                  </Link>
                ) : (
                  person.fatherName || '-'
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
