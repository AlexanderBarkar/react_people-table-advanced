/* eslint-disable jsx-a11y/control-has-associated-label */
import { Link } from 'react-router-dom';
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
  const getNameColor = (sex: string) =>
    sex === 'f' ? 'has-text-danger' : 'has-text-link';

  const findSlug = (name: string | null) =>
    people.find(p => p.name === name)?.slug;

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
                  to={`/people/${person.slug}`}
                  className={getNameColor(person.sex)}
                  data-cy="personName"
                >
                  {person.name}
                </Link>
              </td>

              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>{person.died}</td>

              {/* MOTHER */}
              <td>
                {person.motherName ? (
                  findSlug(person.motherName) ? (
                    <Link
                      to={`/people/${findSlug(person.motherName)}`}
                      className="has-text-danger"
                    >
                      {person.motherName}
                    </Link>
                  ) : (
                    person.motherName
                  )
                ) : (
                  '-'
                )}
              </td>

              {/* FATHER */}
              <td>
                {person.fatherName ? (
                  findSlug(person.fatherName) ? (
                    <Link to={`/people/${findSlug(person.fatherName)}`}>
                      {person.fatherName}
                    </Link>
                  ) : (
                    person.fatherName
                  )
                ) : (
                  '-'
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
