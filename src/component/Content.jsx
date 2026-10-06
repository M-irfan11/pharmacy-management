function Content(){
    return(
        <div className="content">
                <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                        <div className="dash-widget">
							<span className="dash-widget-bg1"><i className="fa fa-stethoscope" aria-hidden="true"></i></span>
							<div className="dash-widget-info text-right">
								<h3>98</h3>
								<span className="widget-title1">Doctors <i className="fa fa-check" aria-hidden="true"></i></span>
							</div>
                        </div>
                    </div>
                   
                 
                 
				
					
				<div className="row">
					<div className="col-12 col-md-6 col-lg-8 col-xl-8">
						<div className="card">
							<div className="card-header">
								<h4 className="card-title d-inline-block">Upcoming Appointments</h4> <a href="appointments.html" className="btn btn-primary float-right">View all</a>
							</div>
							<div className="card-body p-0">
								<div className="table-responsive">
									<table className="table mb-0">
										<thead className="d-none">
											<tr>
												<th>Patient Name</th>
												<th>Doctor Name</th>
												<th>Timing</th>
												<th className="text-right">Status</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td style={{minWidth:  '200px'}}>
													<a className="avatar" href="profile.html">B</a>
													<h2><a href="profile.html">Bernardo Galaviz <span>New York, USA</span></a></h2>
												</td>                 
												
											
											</tr>			             
												
												
												
											<tr>
												<td style={{minWidth:  '200px'}}>
													<a className="avatar" href="profile.html">B</a>
													<h2><a href="profile.html">Bernardo Galaviz <span>New York, USA</span></a></h2>
												</td>                 
											
												
												
											</tr>
											<tr>
												<td style={{minWidth: '200px'}}>
													<a className="avatar" href="profile.html">B</a>
													<h2><a href="profile.html">Bernardo Galaviz <span>New York, USA</span></a></h2>
												</td>                 
												
												
												<td className="text-right">
													<a href="appointments.html" className="btn btn-outline-primary take-btn">Take up</a>
												</td>
											</tr>
											<tr>
												<td style={{minWidth:  '200px'}}>
													<a className="avatar" href="profile.html">B</a>
													<h2><a href="profile.html">Bernardo Galaviz <span>New York, USA</span></a></h2>
												</td>                 
											
											
												<td className="text-right">
													<a href="appointments.html" className="btn btn-outline-primary take-btn">Take up</a>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
                    <div className="col-12 col-md-6 col-lg-4 col-xl-4">
                        <div className="card member-panel">
							<div className="card-header bg-white">
								<h4 className="card-title mb-0">Doctors</h4>
							</div>
                            <div className="card-body">
                                <ul className="contact-list">
                                    <li>
                                        <div className="contact-cont">
                                            <div className="float-left user-img m-r-10">
                                                <a href="profile.html" title="John Doe"><img src="assets/img/user.jpg" alt="" className="w-40 rounded-circle" /><span className="status online"></span></a>
                                            </div>
                                            <div className="contact-info">
                                                <span className="contact-name text-ellipsis">John Doe</span>
                                                <span className="contact-date">MBBS, MD</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="contact-cont">
                                            <div className="float-left user-img m-r-10">
                                                <a href="profile.html" title="Richard Miles"><img src="assets/img/user.jpg" alt="" className="w-40 rounded-circle" /><span className="status offline"></span></a>
                                            </div>
                                            <div className="contact-info">
                                                <span className="contact-name text-ellipsis">Richard Miles</span>
                                                <span className="contact-date">MD</span>
                                            </div>
                                        </div>
                                    </li>
                                   
                                    <li>
                                        <div className="contact-cont">
                                            <div className="float-left user-img m-r-10">
                                                <a href="profile.html" title="Richard Miles"><img src="assets/img/user.jpg" alt="" className="w-40 rounded-circle" /><span className="status online"></span></a>
                                            </div>
                                           
                                        </div>
                                    </li>
                                 
                                    <li>
                                        <div className="contact-cont">
                                            <div className="float-left user-img m-r-10">
                                                <a href="profile.html" title="Richard Miles"><img src="assets/img/user.jpg" alt="" className="w-40 rounded-circle" /><span className="status away"></span></a>
                                            </div>
                                       
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-footer text-center bg-white">
                                <a href="doctors.html" className="text-muted">View all Doctors</a>
                            </div>
                        </div>
                    </div>
				</div>
				<div className="row">
					<div className="col-12 col-md-6 col-lg-8 col-xl-8">
						<div className="card">
							<div className="card-header">
								<h4 className="card-title d-inline-block">New Patients </h4> <a href="patients.html" className="btn btn-primary float-right">View all</a>
							</div>
							<div className="card-block">
								<div className="table-responsive">
									<table className="table mb-0 new-patient-table">
										<tbody>
											
											<tr>
												<td>
													<img width="28" height="28" className="rounded-circle" src="assets/img/user.jpg" alt="" /> 
													<h2>Richard</h2>
												</td>
												<td>Richard123@yahoo.com</td>
												<td>202-555-0127</td>
												<td><button className="btn btn-primary btn-primary-two float-right">Cancer</button></td>
											</tr>
										
										
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div className="col-12 col-md-6 col-lg-4 col-xl-4">
						<div className="hospital-barchart">
							<h4 className="card-title d-inline-block">Hospital Management</h4>
						</div>
						<div className="bar-chart">
							<div className="legend">
								<div className="item">
									<h4>Level1</h4>
								</div>
								
							
							</div>
							
								
								<div className="item">
									<div className="bar">
										<span className="percent">30%</span>									
										<div className="item-progress" data-percent="30">
											<span className="title">Discharge</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					 </div>
				</div>
 </div>

    )
}
export default Content
