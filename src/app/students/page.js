import StudentTable from './StudentTable'
import CustomNavbar from '../components/navbar'

export default function Students() {
	return (
		<div className="bg-gradient-to-r from-slate-50 to-slate-300 ">
      <CustomNavbar activeLink="Students" />
      <div className="p-3">
        <StudentTable />
      </div>
		</div>
	)
}